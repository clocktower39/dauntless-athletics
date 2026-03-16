import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import FamiliesSection from "../../../Components/Dashboard/FamiliesSection";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setFamilies, setOrganizations } from "../../../store/dashboardSlice";

export default function FamiliesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const families = useSelector((state) => state.dashboard.families);
  const [dataError, setDataError] = useState("");
  const [familySearch, setFamilySearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [familyRes, orgRes] = await Promise.all([
          apiRequest("/api/admin/families", { headers: authHeaders }),
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
        ]);
        dispatch(setFamilies(familyRes.families || []));
        dispatch(setOrganizations(orgRes.organizations || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  const filteredFamilies = useMemo(() => {
    let items = [...families];
    const term = familySearch.trim().toLowerCase();

    if (organizationFilter !== "all") {
      items = items.filter((family) => String(family.org_id) === organizationFilter);
    }

    if (statusFilter !== "all") {
      items = items.filter((family) => (family.status || "active") === statusFilter);
    }

    if (!term) return items;

    return items.filter((family) =>
      [
        family.name,
        family.primary_guardian_name,
        family.primary_email,
        family.primary_phone,
        family.city,
        family.state,
      ].some((field) => String(field || "").toLowerCase().includes(term))
    );
  }, [families, familySearch, organizationFilter, statusFilter]);

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <FamiliesSection
        classes={classes}
        familySearch={familySearch}
        onFamilySearchChange={setFamilySearch}
        organizationFilter={organizationFilter}
        onOrganizationFilterChange={setOrganizationFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        organizations={organizations}
        families={filteredFamilies}
        onAddFamily={() => navigate("/dashboard/families/new")}
        onEditFamily={(family) => navigate(`/dashboard/families/${family.id}?edit=1`)}
      />
    </Box>
  );
}
