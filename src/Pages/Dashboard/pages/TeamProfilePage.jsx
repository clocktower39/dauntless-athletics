import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import classes from "../dashboardStyles";
import { emptyTeam } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setContacts, setOrganizations, setSeasons, setTeams } from "../../../store/dashboardSlice";

export default function TeamProfilePage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const seasons = useSelector((state) => state.dashboard.seasons);
  const contacts = useSelector((state) => state.dashboard.contacts);
  const [dataError, setDataError] = useState("");
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(teamId === "new" || startEdit ? "edit" : "view");
  const [teamForm, setTeamForm] = useState(emptyTeam);

  const isNew = teamId === "new";
  const teamIdNumber = Number(teamId);
  const authHeaders = useMemo(() => authHeader(token), [token]);

  const team = useMemo(() => {
    if (isNew) return null;
    return teams.find((item) => Number(item.id) === teamIdNumber) || null;
  }, [teams, teamIdNumber, isNew]);

  const orgMap = useMemo(() => new Map(organizations.map((org) => [String(org.id), org])), [organizations]);
  const seasonMap = useMemo(() => new Map(seasons.map((season) => [String(season.id), season])), [seasons]);

  const contactsForTeam = useMemo(
    () => contacts.filter((contact) => Number(contact.team_id) === Number(teamIdNumber)),
    [contacts, teamIdNumber]
  );

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [teamRes, orgRes, seasonRes, contactRes] = await Promise.all([
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/seasons", { headers: authHeaders }),
          apiRequest("/api/admin/contacts", { headers: authHeaders }),
        ]);
        dispatch(setTeams(teamRes.teams || []));
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setSeasons(seasonRes.seasons || []));
        dispatch(setContacts(contactRes.contacts || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (isNew) {
      setTeamForm(emptyTeam);
      setMode("edit");
      return;
    }
    if (team) {
      setTeamForm({
        organizationId: team.organization_id ? String(team.organization_id) : "",
        seasonId: team.season_id ? String(team.season_id) : "",
        name: team.name || "",
        sport: team.sport || "",
        level: team.level || "",
        season: team.season || "",
        location: team.location || "",
        notes: team.notes || "",
      });
    }
  }, [team, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const handleSave = async () => {
    if (!teamForm.name.trim()) {
      setDataError("Team name is required.");
      return;
    }
    try {
      setDataError("");
      const payload = {
        organization_id: teamForm.organizationId || null,
        season_id: teamForm.seasonId || null,
        name: teamForm.name.trim(),
        sport: teamForm.sport.trim(),
        level: teamForm.level.trim(),
        season: teamForm.season.trim(),
        location: teamForm.location.trim(),
        notes: teamForm.notes.trim(),
      };
      let savedId = teamIdNumber;
      if (isNew) {
        const result = await apiRequest("/api/admin/teams", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        savedId = result.team?.id;
      } else if (teamIdNumber) {
        await apiRequest(`/api/admin/teams/${teamIdNumber}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      const refreshed = await apiRequest("/api/admin/teams", { headers: authHeaders });
      dispatch(setTeams(refreshed.teams || []));
      if (savedId) {
        navigate(`/dashboard/teams/${savedId}`);
      }
      setMode("view");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!teamIdNumber) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/teams/${teamIdNumber}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/teams", { headers: authHeaders });
      dispatch(setTeams(refreshed.teams || []));
      navigate("/dashboard/teams");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const organizationLabel = teamForm.organizationId
    ? orgMap.get(String(teamForm.organizationId))?.name || "—"
    : "Unassigned";
  const seasonLabel = teamForm.seasonId ? seasonMap.get(String(teamForm.seasonId))?.name || "—" : "—";

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {isNew ? "New Team" : teamForm.name || "Team"}
            </Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Teams / Profile</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/teams")}>
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

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Overview</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: "12px" }}>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Organization</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{organizationLabel}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Season</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{seasonLabel}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Contacts</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{contactsForTeam.length}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "720px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Details</Typography>
          <TextField
            select
            label="Organization"
            value={teamForm.organizationId}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, organizationId: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.id} value={String(org.id)}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Season"
            value={teamForm.seasonId}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, seasonId: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          >
            <MenuItem value="">No season</MenuItem>
            {seasons.map((season) => (
              <MenuItem key={season.id} value={String(season.id)}>
                {season.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Team name"
            value={teamForm.name}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, name: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Sport"
              value={teamForm.sport}
              onChange={(event) => setTeamForm((prev) => ({ ...prev, sport: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Level"
              value={teamForm.level}
              onChange={(event) => setTeamForm((prev) => ({ ...prev, level: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
          </Box>
          <TextField
            label="Season label"
            value={teamForm.season}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, season: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <TextField
            label="Location"
            value={teamForm.location}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, location: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <TextField
            label="Notes"
            value={teamForm.notes}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
            disabled={mode === "view"}
          />
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)", marginBottom: "8px" }}>Contacts</Typography>
          {contactsForTeam.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>No contacts linked yet.</Typography>
          ) : (
            <DataGrid
              rows={contactsForTeam}
              columns={[
                { field: "name", headerName: "Name", flex: 1, minWidth: 200 },
                { field: "role", headerName: "Role", width: 160 },
                { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
                { field: "phone", headerName: "Phone", width: 160 },
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
      </Box>
    </Box>
  );
}
