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
import {
  athleteStatusOptions,
  dayOptions,
  emptyAthlete,
  emptyPractice,
  emptyTeam,
} from "../dashboardConstants";
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
  const [athletes, setAthletes] = useState([]);
  const [athleteModalOpen, setAthleteModalOpen] = useState(false);
  const [athleteForm, setAthleteForm] = useState(emptyAthlete);
  const [editingAthleteId, setEditingAthleteId] = useState(null);

  const isNew = teamId === "new";
  const teamIdNumber = Number(teamId);
  const authHeaders = useMemo(() => authHeader(token), [token]);

  const team = useMemo(() => {
    if (isNew) return null;
    return teams.find((item) => Number(item.id) === teamIdNumber) || null;
  }, [teams, teamIdNumber, isNew]);

  const orgMap = useMemo(() => new Map(organizations.map((org) => [String(org.id), org])), [organizations]);
  const seasonMap = useMemo(() => new Map(seasons.map((season) => [String(season.id), season])), [seasons]);
  const activeSeasonId = useMemo(() => {
    if (isNew) return null;
    return Number(team?.season_id || teamForm.seasonId || 0) || null;
  }, [isNew, team?.season_id, teamForm.seasonId]);

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
        expectedAthleteCount: team.expected_athlete_count || 0,
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

  useEffect(() => {
    if (!token || isNew || !teamIdNumber || !activeSeasonId) {
      setAthletes([]);
      return;
    }
    const loadAthletes = async () => {
      try {
        const athleteRes = await apiRequest(
          `/api/admin/athletes?team_id=${teamIdNumber}&season_id=${activeSeasonId}`,
          { headers: authHeaders }
        );
        setAthletes(athleteRes.athletes || []);
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadAthletes();
  }, [token, isNew, teamIdNumber, activeSeasonId, authHeaders]);

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
        expected_athlete_count: Number(teamForm.expectedAthleteCount || 0),
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

  const reloadAthletes = async () => {
    if (!teamIdNumber || !activeSeasonId) return;
    const athleteRes = await apiRequest(
      `/api/admin/athletes?team_id=${teamIdNumber}&season_id=${activeSeasonId}`,
      { headers: authHeaders }
    );
    setAthletes(athleteRes.athletes || []);
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

  const handleOpenAthleteModal = () => {
    setEditingAthleteId(null);
    setAthleteForm(emptyAthlete);
    setAthleteModalOpen(true);
  };

  const handleEditAthlete = (athlete) => {
    setEditingAthleteId(athlete.id);
    setAthleteForm({
      firstName: athlete.first_name || "",
      lastName: athlete.last_name || "",
      dob: athlete.dob ? String(athlete.dob).slice(0, 10) : "",
      gender: athlete.gender || "",
      status: athlete.status || "active",
      positions: athlete.positions || "",
      skillNotes: athlete.skill_notes || "",
      goalNotes: athlete.goal_notes || "",
      notes: athlete.notes || "",
      startDate: athlete.start_date ? String(athlete.start_date).slice(0, 10) : "",
      endDate: athlete.end_date ? String(athlete.end_date).slice(0, 10) : "",
    });
    setAthleteModalOpen(true);
  };

  const handleCloseAthleteModal = () => {
    setEditingAthleteId(null);
    setAthleteForm(emptyAthlete);
    setAthleteModalOpen(false);
  };

  const handleSaveAthlete = async () => {
    if (!teamIdNumber || !activeSeasonId) {
      setDataError("Save the team with a season before adding athletes.");
      return;
    }
    try {
      setDataError("");
      const payload = {
        first_name: athleteForm.firstName.trim(),
        last_name: athleteForm.lastName.trim(),
        dob: athleteForm.dob || null,
        gender: athleteForm.gender.trim(),
        team_id: teamIdNumber,
        season_id: activeSeasonId,
        status: athleteForm.status,
        positions: athleteForm.positions.trim(),
        skill_notes: athleteForm.skillNotes.trim(),
        goal_notes: athleteForm.goalNotes.trim(),
        notes: athleteForm.notes.trim(),
        start_date: athleteForm.startDate || null,
        end_date: athleteForm.endDate || null,
      };
      if (editingAthleteId) {
        await apiRequest(`/api/admin/athletes/${editingAthleteId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/admin/athletes", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      await reloadAthletes();
      const refreshed = await apiRequest("/api/admin/teams", { headers: authHeaders });
      dispatch(setTeams(refreshed.teams || []));
      handleCloseAthleteModal();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleRemoveAthlete = async (athlete) => {
    if (!teamIdNumber || !activeSeasonId) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/athletes/${athlete.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          first_name: athlete.first_name,
          last_name: athlete.last_name,
          dob: athlete.dob ? String(athlete.dob).slice(0, 10) : null,
          gender: athlete.gender || null,
          team_id: teamIdNumber,
          season_id: activeSeasonId,
          status: "removed",
          positions: athlete.positions || "",
          skill_notes: athlete.skill_notes || "",
          goal_notes: athlete.goal_notes || "",
          notes: athlete.notes || "",
          start_date: athlete.start_date ? String(athlete.start_date).slice(0, 10) : null,
          end_date: new Date().toISOString().slice(0, 10),
        }),
      });
      await reloadAthletes();
      const refreshed = await apiRequest("/api/admin/teams", { headers: authHeaders });
      dispatch(setTeams(refreshed.teams || []));
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
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Athletes</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {athletes.filter((athlete) => athlete.status === "active").length}
                {` / ${Number(teamForm.expectedAthleteCount || 0)}`}
              </Typography>
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
            label="Expected athletes"
            type="number"
            value={teamForm.expectedAthleteCount}
            onChange={(event) =>
              setTeamForm((prev) => ({ ...prev, expectedAthleteCount: Math.max(0, Number(event.target.value) || 0) }))
            }
            sx={classes.input}
            inputProps={{ min: 0 }}
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
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Athletes</Typography>
                  <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    Track the active roster for this team and season.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={classes.button}
                  onClick={handleOpenAthleteModal}
                  disabled={!activeSeasonId}
                >
                  Add Athlete
                </Button>
              </Box>
              {!activeSeasonId ? (
                <Typography sx={{ color: "var(--color-muted)" }}>
                  Save a season on this team before managing athlete assignments.
                </Typography>
              ) : athletes.length === 0 ? (
                <Typography sx={{ color: "var(--color-muted)" }}>No athletes assigned for this season yet.</Typography>
              ) : (
                <DataGrid
                  rows={athletes}
                  columns={[
                    {
                      field: "full_name",
                      headerName: "Athlete",
                      flex: 1,
                      minWidth: 180,
                      valueGetter: (_value, row) =>
                        [row?.first_name, row?.last_name].filter(Boolean).join(" ") || "—",
                    },
                    {
                      field: "status",
                      headerName: "Status",
                      width: 130,
                      valueGetter: (_value, row) => row?.status || "—",
                    },
                    {
                      field: "positions",
                      headerName: "Positions",
                      flex: 1,
                      minWidth: 160,
                      valueGetter: (_value, row) => row?.positions || "—",
                    },
                    {
                      field: "goal_notes",
                      headerName: "Goals",
                      flex: 1,
                      minWidth: 180,
                      valueGetter: (_value, row) => row?.goal_notes || "—",
                    },
                    {
                      field: "skill_notes",
                      headerName: "Skills",
                      flex: 1,
                      minWidth: 180,
                      valueGetter: (_value, row) => row?.skill_notes || "—",
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
                            { label: "Edit", onClick: () => handleEditAthlete(params.row) },
                            params.row.status === "active"
                              ? {
                                  label: "Remove from team",
                                  onClick: () => handleRemoveAthlete(params.row),
                                  color: "danger",
                                }
                              : null,
                          ].filter(Boolean)}
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

      <Dialog
        open={athleteModalOpen}
        onClose={handleCloseAthleteModal}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingAthleteId ? "Edit Athlete" : "Add Athlete"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="First name"
              value={athleteForm.firstName}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, firstName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              label="Last name"
              value={athleteForm.lastName}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, lastName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Date of birth"
              type="date"
              value={athleteForm.dob}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, dob: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Gender"
              value={athleteForm.gender}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, gender: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              select
              label="Status"
              value={athleteForm.status}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, status: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            >
              {athleteStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <TextField
            label="Positions"
            value={athleteForm.positions}
            onChange={(event) => setAthleteForm((prev) => ({ ...prev, positions: event.target.value }))}
            sx={classes.input}
          />
          <TextField
            label="Skill notes"
            value={athleteForm.skillNotes}
            onChange={(event) => setAthleteForm((prev) => ({ ...prev, skillNotes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <TextField
            label="Goals"
            value={athleteForm.goalNotes}
            onChange={(event) => setAthleteForm((prev) => ({ ...prev, goalNotes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <TextField
            label="Roster notes"
            value={athleteForm.notes}
            onChange={(event) => setAthleteForm((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Start date"
              type="date"
              value={athleteForm.startDate}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, startDate: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End date"
              type="date"
              value={athleteForm.endDate}
              onChange={(event) => setAthleteForm((prev) => ({ ...prev, endDate: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleCloseAthleteModal}>
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveAthlete}>
            {editingAthleteId ? "Save Athlete" : "Add Athlete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
