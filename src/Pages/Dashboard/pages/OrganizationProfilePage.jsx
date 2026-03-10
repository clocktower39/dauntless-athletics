import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import classes from "../dashboardStyles";
import { organizationTypeOptions } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setOrganizations, setTeams } from "../../../store/dashboardSlice";

const emptyOrg = {
  id: null,
  name: "",
  type: "school",
  parentId: "",
  status: "active",
};

export default function OrganizationProfilePage() {
  const { organizationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const [dataError, setDataError] = useState("");
  const [tab, setTab] = useState(0);
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(organizationId === "new" || startEdit ? "edit" : "view");
  const [orgDraft, setOrgDraft] = useState(emptyOrg);

  const authHeaders = useMemo(() => authHeader(token), [token]);
  const orgId = Number(organizationId);
  const isNew = organizationId === "new";

  const org = useMemo(() => {
    if (isNew) return null;
    return organizations.find((item) => Number(item.id) === orgId) || null;
  }, [organizations, orgId, isNew]);

  const teamsForOrg = useMemo(
    () => teams.filter((team) => Number(team.organization_id) === Number(orgId)),
    [teams, orgId]
  );

  const districtMap = useMemo(() => {
    const map = new Map();
    organizations.forEach((item) => {
      map.set(String(item.id), item.name);
    });
    return map;
  }, [organizations]);

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
    if (isNew) {
      setOrgDraft(emptyOrg);
      setMode("edit");
      return;
    }
    if (org) {
      setOrgDraft({
        id: org.id,
        name: org.name || "",
        type: org.type || "school",
        parentId: org.parent_id ? String(org.parent_id) : "",
        status: org.status || "active",
      });
    }
  }, [org, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const handleSave = async () => {
    try {
      setDataError("");
      const payload = {
        name: orgDraft.name,
        type: orgDraft.type,
        status: orgDraft.status,
        parent_id: orgDraft.parentId || null,
      };
      let savedId = orgDraft.id;
      if (isNew) {
        const result = await apiRequest("/api/admin/organizations", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        savedId = result.organization?.id;
      } else if (orgDraft.id) {
        await apiRequest(`/api/admin/organizations/${orgDraft.id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      const orgRes = await apiRequest("/api/admin/organizations", { headers: authHeaders });
      dispatch(setOrganizations(orgRes.organizations || []));
      if (savedId) {
        navigate(`/dashboard/organizations/${savedId}`);
      }
      setMode("view");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!orgDraft.id) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${orgDraft.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const orgRes = await apiRequest("/api/admin/organizations", { headers: authHeaders });
      dispatch(setOrganizations(orgRes.organizations || []));
      navigate("/dashboard/organizations");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const parentLabel =
    orgDraft.parentId && districtMap.get(String(orgDraft.parentId))
      ? districtMap.get(String(orgDraft.parentId))
      : "No parent";

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {isNew ? "New Organization" : orgDraft.name || "Organization"}
            </Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Organizations / Profile</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/organizations")}>
              Back to list
            </Button>
            {mode === "view" ? (
              <Button variant="contained" sx={classes.button} onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <Button variant="contained" sx={classes.button} onClick={handleSave}>
                Save
              </Button>
            )}
            {!isNew && (
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          sx={{ "& .MuiTab-root": { color: "var(--color-muted)" }, "& .Mui-selected": { color: "var(--color-text)" } }}
        >
          <Tab label="Overview" />
          <Tab label="Details" />
          <Tab label="Teams" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
            <Box sx={{ display: "grid", gap: "6px" }}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>Organization</Typography>
              <Typography sx={{ color: "var(--color-text)", fontSize: "1.2rem", fontWeight: 700 }}>
                {orgDraft.name || "Unnamed"}
              </Typography>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: "12px" }}>
              <Box sx={classes.statCard}>
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Type</Typography>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{orgDraft.type || "—"}</Typography>
              </Box>
              <Box sx={classes.statCard}>
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Parent</Typography>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{parentLabel}</Typography>
              </Box>
              <Box sx={classes.statCard}>
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Teams</Typography>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{teamsForOrg.length}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "640px" }}>
            <TextField
              label="Organization name"
              value={orgDraft.name}
              onChange={(event) => setOrgDraft((prev) => ({ ...prev, name: event.target.value }))}
              sx={classes.input}
              disabled={mode === "view"}
            />
            <TextField
              select
              label="Type"
              value={orgDraft.type}
              onChange={(event) => setOrgDraft((prev) => ({ ...prev, type: event.target.value }))}
              sx={classes.input}
              disabled={mode === "view"}
            >
              {organizationTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Parent organization"
              value={orgDraft.parentId}
              onChange={(event) => setOrgDraft((prev) => ({ ...prev, parentId: event.target.value }))}
              sx={classes.input}
              disabled={mode === "view"}
            >
              <MenuItem value="">No parent</MenuItem>
              {organizations.map((item) => (
                <MenuItem key={item.id} value={String(item.id)}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={orgDraft.status}
              onChange={(event) => setOrgDraft((prev) => ({ ...prev, status: event.target.value }))}
              sx={classes.input}
              disabled={mode === "view"}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ paddingTop: "8px" }}>
            {teamsForOrg.length === 0 ? (
              <Typography sx={{ color: "var(--color-muted)" }}>No teams linked yet.</Typography>
            ) : (
              <DataGrid
                rows={teamsForOrg}
                columns={[
                  { field: "name", headerName: "Team", flex: 1, minWidth: 200 },
                  { field: "level", headerName: "Level", width: 140 },
                  { field: "season_name", headerName: "Season", width: 160 },
                  { field: "location", headerName: "Location", flex: 1, minWidth: 180 },
                ]}
                autoHeight
                density="compact"
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
                sx={classes.dataGrid}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
