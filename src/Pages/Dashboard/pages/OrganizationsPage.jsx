import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import OrganizationsSection from "../../../Components/Dashboard/OrganizationsSection";
import OrganizationDrawer from "../../../Components/Dashboard/OrganizationDrawer";
import classes from "../dashboardStyles";
import { organizationTypeOptions } from "../dashboardConstants";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setOrganizations, setTeams } from "../../../store/dashboardSlice";

const initialDraft = {
  id: null,
  name: "",
  type: "school",
  parentId: "",
  status: "active",
};

export default function OrganizationsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const [dataError, setDataError] = useState("");
  const [organizationSearch, setOrganizationSearch] = useState("");
  const [organizationTypeFilter, setOrganizationTypeFilter] = useState("all");
  const [organizationParentFilter, setOrganizationParentFilter] = useState("all");
  const [organizationStatusFilter, setOrganizationStatusFilter] = useState("all");
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);
  const [orgDrawerOpen, setOrgDrawerOpen] = useState(false);
  const [orgDrawerMode, setOrgDrawerMode] = useState("view");
  const [orgDraft, setOrgDraft] = useState(initialDraft);

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

  const allOrganizationsSelected =
    filteredOrganizations.length > 0 && selectedOrganizationIds.length === filteredOrganizations.length;

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      openOrganizationDrawer(null, "create");
    }
  }, [location.search]);

  const openOrganizationDrawer = (org = null, mode = "view") => {
    setOrgDraft({
      id: org?.id || null,
      name: org?.name || "",
      type: org?.type || "school",
      parentId: org?.parent_id ? String(org.parent_id) : "",
      status: org?.status || "active",
    });
    setOrgDrawerMode(mode);
    setOrgDrawerOpen(true);
  };

  const handleSaveOrganization = async () => {
    if (!orgDraft.name.trim()) {
      setDataError("Organization name is required.");
      return;
    }
    if (!orgDraft.type) {
      setDataError("Organization type is required.");
      return;
    }

    try {
      setDataError("");
      if (orgDrawerMode === "create") {
        await apiRequest("/api/admin/organizations", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            name: orgDraft.name.trim(),
            type: orgDraft.type,
            parent_id: orgDraft.parentId ? Number(orgDraft.parentId) : null,
            status: orgDraft.status || "active",
          }),
        });
      } else if (orgDraft.id) {
        await apiRequest(`/api/admin/organizations/${orgDraft.id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            name: orgDraft.name.trim(),
            type: orgDraft.type,
            parent_id: orgDraft.parentId ? Number(orgDraft.parentId) : null,
            status: orgDraft.status || "active",
          }),
        });
      }
      const result = await apiRequest("/api/admin/organizations", { headers: authHeaders });
      dispatch(setOrganizations(result.organizations || []));
      setOrgDrawerOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

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

  const toggleOrganizationSelection = (id) => {
    setSelectedOrganizationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAllOrganizations = () => {
    if (allOrganizationsSelected) {
      setSelectedOrganizationIds([]);
    } else {
      setSelectedOrganizationIds(filteredOrganizations.map((org) => org.id));
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

  const orgReadOnly = orgDrawerMode === "view";

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
        allOrganizationsSelected={allOrganizationsSelected}
        onToggleAllOrganizations={handleToggleAllOrganizations}
        onToggleOrganizationSelection={toggleOrganizationSelection}
        onBulkArchive={handleBulkArchiveOrganizations}
        onClearSelection={() => setSelectedOrganizationIds([])}
        onNewOrganization={() => openOrganizationDrawer(null, "create")}
        onViewOrganization={(org) => openOrganizationDrawer(org, "view")}
        onEditOrganization={(org) => openOrganizationDrawer(org, "edit")}
        onDeleteOrganization={handleDeleteOrganization}
        teamCountByOrg={teamCountByOrg}
        teamsByOrganization={teamsByOrganization}
        districtMap={districtMap}
        organizationTypeMap={organizationTypeMap}
        formatDate={formatDate}
      />

      <OrganizationDrawer
        open={orgDrawerOpen}
        onClose={() => setOrgDrawerOpen(false)}
        classes={classes}
        orgDrawerMode={orgDrawerMode}
        orgDraft={orgDraft}
        onDraftChange={setOrgDraft}
        organizationTypeOptions={organizationTypeOptions}
        districts={districts}
        readOnly={orgReadOnly}
        onSave={handleSaveOrganization}
        onEdit={() => setOrgDrawerMode("edit")}
      />
    </Box>
  );
}
