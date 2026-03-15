import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import classes from "../dashboardStyles";
import { dayOptions, emptyPractice, emptyTeam } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setContacts, setOrganizations, setSeasons, setTeams } from "../../../store/dashboardSlice";
import RowActionsMenu from "../../../Components/Dashboard/RowActionsMenu";

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
  const [practices, setPractices] = useState([]);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [practiceForm, setPracticeForm] = useState(emptyPractice);
  const [editingPracticeId, setEditingPracticeId] = useState(null);

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

  const practiceCoachOptions = useMemo(
    () => contactsForTeam.filter((contact) => contact.id),
    [contactsForTeam]
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

  useEffect(() => {
    if (!token || isNew || !teamIdNumber) {
      setPractices([]);
      return;
    }
    const loadPractices = async () => {
      try {
        const practiceRes = await apiRequest(`/api/admin/practices?team_id=${teamIdNumber}`, {
          headers: authHeaders,
        });
        setPractices(practiceRes.practices || []);
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadPractices();
  }, [token, isNew, teamIdNumber, authHeaders]);

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

  const reloadPractices = async () => {
    if (!teamIdNumber) return;
    const practiceRes = await apiRequest(`/api/admin/practices?team_id=${teamIdNumber}`, {
      headers: authHeaders,
    });
    setPractices(practiceRes.practices || []);
  };

  const handleOpenPracticeModal = () => {
    setEditingPracticeId(null);
    setPracticeForm({ ...emptyPractice, teamId: String(teamIdNumber) });
    setPracticeModalOpen(true);
  };

  const handleEditPractice = (practice) => {
    setEditingPracticeId(practice.id);
    setPracticeForm({
      teamId: practice.team_id ? String(practice.team_id) : String(teamIdNumber),
      contactId: practice.contact_id ? String(practice.contact_id) : "",
      dayOfWeek: practice.day_of_week ?? 1,
      startTime: practice.start_time?.slice(0, 5) || "15:00",
      endTime: practice.end_time?.slice(0, 5) || "17:00",
      location: practice.location || "",
      notes: practice.notes || "",
    });
    setPracticeModalOpen(true);
  };

  const handleClosePracticeModal = () => {
    setEditingPracticeId(null);
    setPracticeForm({ ...emptyPractice, teamId: String(teamIdNumber || "") });
    setPracticeModalOpen(false);
  };

  const handleSavePractice = async () => {
    if (!teamIdNumber) return;
    try {
      setDataError("");
      const payload = {
        team_id: teamIdNumber,
        contact_id: practiceForm.contactId ? Number(practiceForm.contactId) : null,
        day_of_week: Number(practiceForm.dayOfWeek),
        start_time: practiceForm.startTime,
        end_time: practiceForm.endTime,
        location: practiceForm.location.trim(),
        notes: practiceForm.notes.trim(),
      };
      if (editingPracticeId) {
        await apiRequest(`/api/admin/practices/${editingPracticeId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/admin/practices", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      await reloadPractices();
      handleClosePracticeModal();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeletePractice = async (practiceId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/practices/${practiceId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await reloadPractices();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const organizationLabel = teamForm.organizationId
    ? orgMap.get(String(teamForm.organizationId))?.name || "—"
    : "Unassigned";
  const seasonLabel = teamForm.seasonId ? seasonMap.get(String(teamForm.seasonId))?.name || "—" : "—";
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };

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
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Practices</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{practices.length}</Typography>
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

        {!isNew && (
          <>
            <Box sx={{ paddingTop: "8px" }}>
              <Box sx={classes.workspaceHeader}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Practices</Typography>
                  <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    Manage this team&apos;s practice schedule here.
                  </Typography>
                </Box>
                <Button variant="contained" sx={classes.button} onClick={handleOpenPracticeModal}>
                  Add Practice
                </Button>
              </Box>
              {practices.length === 0 ? (
                <Typography sx={{ color: "var(--color-muted)" }}>No practices scheduled yet.</Typography>
              ) : (
                <DataGrid
                  rows={practices}
                  columns={[
                    {
                      field: "day_of_week",
                      headerName: "Day",
                      width: 140,
                      valueGetter: (_value, row) =>
                        dayOptions.find((day) => day.value === row?.day_of_week)?.label || "—",
                    },
                    {
                      field: "time",
                      headerName: "Time",
                      width: 160,
                      valueGetter: (_value, row) =>
                        row?.start_time?.slice(0, 5) && row?.end_time?.slice(0, 5)
                          ? `${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}`
                          : "—",
                    },
                    {
                      field: "contact_name",
                      headerName: "Coach",
                      flex: 1,
                      minWidth: 160,
                      valueGetter: (_value, row) => row?.contact_name || "—",
                      renderCell: (params) =>
                        params.row.contact_id ? (
                          <Link component={RouterLink} to={`/dashboard/people/${params.row.contact_id}`} sx={linkSx}>
                            {params.value}
                          </Link>
                        ) : (
                          params.value
                        ),
                    },
                    {
                      field: "location",
                      headerName: "Location",
                      flex: 1,
                      minWidth: 180,
                      valueGetter: (_value, row) => row?.location || "—",
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      minWidth: 120,
                      sortable: false,
                      filterable: false,
                      renderCell: (params) => (
                        <RowActionsMenu
                          actions={[
                            { label: "Edit", onClick: () => handleEditPractice(params.row) },
                            { label: "Delete", onClick: () => handleDeletePractice(params.row.id), color: "danger" },
                          ]}
                        />
                      ),
                    },
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

            <Divider sx={{ borderColor: "var(--color-border)" }} />
          </>
        )}

        <Box sx={{ paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)", marginBottom: "8px" }}>Contacts</Typography>
          {contactsForTeam.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>No contacts linked yet.</Typography>
          ) : (
            <DataGrid
              rows={contactsForTeam}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  minWidth: 200,
                  renderCell: (params) => (
                    <Link component={RouterLink} to={`/dashboard/people/${params.row.id}`} sx={linkSx}>
                      {params.value}
                    </Link>
                  ),
                },
                { field: "role", headerName: "Role", width: 160 },
                { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
                { field: "phone", headerName: "Phone", width: 160 },
                {
                  field: "actions",
                  headerName: "Actions",
                  minWidth: 120,
                  sortable: false,
                  filterable: false,
                  renderCell: (params) => (
                    <RowActionsMenu
                      actions={[
                        { label: "View", onClick: () => navigate(`/dashboard/people/${params.row.id}`) },
                        { label: "Edit", onClick: () => navigate(`/dashboard/people/${params.row.id}?edit=1`) },
                      ]}
                    />
                  ),
                },
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

      <Dialog
        open={practiceModalOpen}
        onClose={handleClosePracticeModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingPracticeId ? "Edit Practice" : "Add Practice"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              select
              label="Day"
              value={practiceForm.dayOfWeek}
              onChange={(event) =>
                setPracticeForm((prev) => ({ ...prev, dayOfWeek: Number(event.target.value) }))
              }
              sx={{ ...classes.input, flex: 1, minWidth: "160px" }}
            >
              {dayOptions.map((day) => (
                <MenuItem key={day.value} value={day.value}>
                  {day.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="time"
              label="Start"
              value={practiceForm.startTime}
              onChange={(event) => setPracticeForm((prev) => ({ ...prev, startTime: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "140px" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="time"
              label="End"
              value={practiceForm.endTime}
              onChange={(event) => setPracticeForm((prev) => ({ ...prev, endTime: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "140px" }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            select
            label="Coach / Primary Contact"
            value={practiceForm.contactId}
            onChange={(event) => setPracticeForm((prev) => ({ ...prev, contactId: event.target.value }))}
            sx={classes.input}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {practiceCoachOptions.map((contact) => (
              <MenuItem key={contact.id} value={contact.id}>
                {contact.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Location"
            value={practiceForm.location}
            onChange={(event) => setPracticeForm((prev) => ({ ...prev, location: event.target.value }))}
            sx={classes.input}
          />
          <TextField
            label="Notes"
            value={practiceForm.notes}
            onChange={(event) => setPracticeForm((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleClosePracticeModal}>
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSavePractice}>
            {editingPracticeId ? "Save Practice" : "Add Practice"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
