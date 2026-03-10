import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import OrganizationsSection from "../../../Components/Dashboard/OrganizationsSection";
import classes from "../dashboardStyles";
import { organizationTypeOptions } from "../dashboardConstants";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setOrganizations, setTeams } from "../../../store/dashboardSlice";

export default function OrganizationsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const [dataError, setDataError] = useState("");
  const [organizationSearch, setOrganizationSearch] = useState("");
  const [organizationTypeFilter, setOrganizationTypeFilter] = useState("all");
  const [organizationParentFilter, setOrganizationParentFilter] = useState("all");
  const [organizationStatusFilter, setOrganizationStatusFilter] = useState("all");
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const districts = useMemo(
    () => organizations.filter((org) => !org.parent_id),
    [organizations]
  );

  const organizationTypeMap = useMemo(
    () => new Map(organizationTypeOptions.map((option) => [option.value, option.label])),
    []
  );

  const districtMap = useMemo(
    () => new Map(districts.map((district) => [String(district.id), district.name])),
    [districts]
  );

  const filteredOrganizations = useMemo(() => {
    let items = [...organizations];
    const term = organizationSearch.trim().toLowerCase();
    if (term) {
      items = items.filter((org) => org.name?.toLowerCase().includes(term));
    }
    if (organizationTypeFilter !== "all") {
      items = items.filter((org) => org.type === organizationTypeFilter);
    }
    if (organizationParentFilter === "none") {
      items = items.filter((org) => !org.parent_id);
    } else if (organizationParentFilter !== "all") {
      items = items.filter((org) => String(org.parent_id) === organizationParentFilter);
    }
    if (organizationStatusFilter !== "all") {
      items = items.filter((org) => (org.status || "active") === organizationStatusFilter);
    }
    return items;
  }, [organizations, organizationSearch, organizationTypeFilter, organizationParentFilter, organizationStatusFilter]);

  const teamCountByOrg = useMemo(() => {
    return teams.reduce((acc, team) => {
      if (team.organization_id) {
        acc[team.organization_id] = (acc[team.organization_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, [teams]);

  const teamsByOrganization = useMemo(() => {
    return teams.reduce((acc, team) => {
      if (team.organization_id) {
        const key = String(team.organization_id);
        if (!acc[key]) acc[key] = [];
        acc[key].push(team);
      }
      return acc;
    }, {});
  }, [teams]);


  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, teamRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/teams", { headers: authHeaders }),
        ]);
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setTeams(teamRes.teams || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (organizationSearch || organizationTypeFilter !== "all" || organizationParentFilter !== "all" || organizationStatusFilter !== "all") {
      setSelectedOrganizationIds([]);
    }
  }, [organizationSearch, organizationTypeFilter, organizationParentFilter, organizationStatusFilter]);


  const handleDeleteOrganization = async (organizationId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${organizationId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const result = await apiRequest("/api/admin/organizations", { headers: authHeaders });
      dispatch(setOrganizations(result.organizations || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleBulkArchiveOrganizations = async () => {
    if (selectedOrganizationIds.length === 0) return;
    try {
      setDataError("");
      await Promise.all(
        selectedOrganizationIds.map((id) =>
          apiRequest(`/api/admin/organizations/${id}`, {
            method: "DELETE",
            headers: authHeaders,
          })
        )
      );
      setSelectedOrganizationIds([]);
      const result = await apiRequest("/api/admin/organizations", { headers: authHeaders });
      dispatch(setOrganizations(result.organizations || []));
    } catch (error) {
      setDataError(error.message);
    }
  };


  const handleSelectedOrganizationIdsChange = (selection) => {
    if (Array.isArray(selection)) {
      setSelectedOrganizationIds(selection);
      return;
    }
    if (selection && selection.ids) {
      setSelectedOrganizationIds(Array.from(selection.ids));
      return;
    }
    setSelectedOrganizationIds([]);
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <OrganizationsSection
        classes={classes}
        organizationSearch={organizationSearch}
        onOrganizationSearchChange={setOrganizationSearch}
        organizationTypeFilter={organizationTypeFilter}
        onOrganizationTypeFilterChange={setOrganizationTypeFilter}
        organizationParentFilter={organizationParentFilter}
        onOrganizationParentFilterChange={setOrganizationParentFilter}
        organizationStatusFilter={organizationStatusFilter}
        onOrganizationStatusFilterChange={setOrganizationStatusFilter}
        organizationTypeOptions={organizationTypeOptions}
        districts={districts}
        filteredOrganizations={filteredOrganizations}
        selectedOrganizationIds={selectedOrganizationIds}
        onSelectedOrganizationIdsChange={handleSelectedOrganizationIdsChange}
        onBulkArchive={handleBulkArchiveOrganizations}
        onClearSelection={() => setSelectedOrganizationIds([])}
        onNewOrganization={() => navigate("/dashboard/organizations/new")}
        onViewOrganization={(org) => navigate(`/dashboard/organizations/${org.id}`)}
        onEditOrganization={(org) => navigate(`/dashboard/organizations/${org.id}?edit=1`)}
        onDeleteOrganization={handleDeleteOrganization}
        teamCountByOrg={teamCountByOrg}
        teamsByOrganization={teamsByOrganization}
        districtMap={districtMap}
        organizationTypeMap={organizationTypeMap}
        formatDate={formatDate}
      />

    </Box>
  );
}
