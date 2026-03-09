import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import TeamsSection from "../../../Components/Dashboard/TeamsSection";
import classes from "../dashboardStyles";
import { dayOptions, emptyPractice, emptyTeam } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setContacts, setPractices, setSeasons, setTeams, setOrganizations } from "../../../store/dashboardSlice";

export default function TeamsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const seasons = useSelector((state) => state.dashboard.seasons);
  const practices = useSelector((state) => state.dashboard.practices);
  const contacts = useSelector((state) => state.dashboard.contacts);
  const [dataError, setDataError] = useState("");
  const [teamSearch, setTeamSearch] = useState("");
  const [teamOrgFilter, setTeamOrgFilter] = useState("all");
  const [teamSeasonFilter, setTeamSeasonFilter] = useState("all");
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [practiceForm, setPracticeForm] = useState(emptyPractice);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingPracticeId, setEditingPracticeId] = useState(null);
  const [editingSeasonId, setEditingSeasonId] = useState(null);
  const [editingSeasonName, setEditingSeasonName] = useState("");
  const [editingSeasonStart, setEditingSeasonStart] = useState("");
  const [editingSeasonEnd, setEditingSeasonEnd] = useState("");
  const [editingSeasonActive, setEditingSeasonActive] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [newSeasonStart, setNewSeasonStart] = useState("");
  const [newSeasonEnd, setNewSeasonEnd] = useState("");
  const [newSeasonActive, setNewSeasonActive] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const filteredTeams = useMemo(() => {
    let items = [...teams];
    const term = teamSearch.trim().toLowerCase();
    if (term) {
      items = items.filter((team) => team.name?.toLowerCase().includes(term));
    }
    if (teamOrgFilter !== "all") {
      items = items.filter((team) => String(team.organization_id) === teamOrgFilter);
    }
    if (teamSeasonFilter !== "all") {
      items = items.filter((team) => String(team.season_id) === teamSeasonFilter);
    }
    return items;
  }, [teams, teamSearch, teamOrgFilter, teamSeasonFilter]);

  const seasonMap = useMemo(
    () => new Map(seasons.map((season) => [String(season.id), season.name])),
    [seasons]
  );

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, teamRes, seasonRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/seasons", { headers: authHeaders }),
        ]);
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setTeams(teamRes.teams || []));
        dispatch(setSeasons(seasonRes.seasons || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (!selectedTeamId && teams.length > 0) {
      setSelectedTeamId(String(teams[0].id));
    }
  }, [selectedTeamId, teams]);

  useEffect(() => {
    if (!selectedTeamId) {
      dispatch(setContacts([]));
      dispatch(setPractices([]));
      return;
    }
    const loadTeamDetail = async () => {
      try {
        const [contactsRes, practicesRes] = await Promise.all([
          apiRequest(`/api/admin/contacts?team_id=${selectedTeamId}`, { headers: authHeaders }),
          apiRequest(`/api/admin/practices?team_id=${selectedTeamId}`, { headers: authHeaders }),
        ]);
        dispatch(setContacts(contactsRes.contacts || []));
        dispatch(setPractices(practicesRes.practices || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadTeamDetail();
  }, [selectedTeamId, authHeaders, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      handleOpenTeamModal();
    }
  }, [location.search]);

  const handleOpenTeamModal = () => {
    setEditingTeamId(null);
    setTeamForm((prev) => ({
      ...emptyTeam,
      seasonId: prev.seasonId || "",
    }));
    setTeamModalOpen(true);
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) {
      setDataError("Team name is required.");
      return;
    }
    try {
      setDataError("");
      const payload = {
        organization_id: teamForm.organizationId ? Number(teamForm.organizationId) : null,
        season_id: teamForm.seasonId ? Number(teamForm.seasonId) : null,
        name: teamForm.name.trim(),
        sport: teamForm.sport.trim(),
        level: teamForm.level.trim(),
        season: teamForm.season.trim(),
        location: teamForm.location.trim(),
        notes: teamForm.notes.trim(),
      };
      if (editingTeamId) {
        await apiRequest(`/api/admin/teams/${editingTeamId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/admin/teams", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      const teamRes = await apiRequest("/api/admin/teams", { headers: authHeaders });
      dispatch(setTeams(teamRes.teams || []));
      setTeamForm(emptyTeam);
      setEditingTeamId(null);
      setTeamModalOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeamId(team.id);
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
    setTeamModalOpen(true);
  };

  const handleCancelTeamEdit = () => {
    setEditingTeamId(null);
    setTeamForm(emptyTeam);
    setTeamModalOpen(false);
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/teams/${teamId}`, { method: "DELETE", headers: authHeaders });
      const teamRes = await apiRequest("/api/admin/teams", { headers: authHeaders });
      dispatch(setTeams(teamRes.teams || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleSaveSeason = async () => {
    const isEditing = Boolean(editingSeasonId);
    const name = isEditing ? editingSeasonName : newSeasonName;
    if (!name.trim()) {
      setDataError("Season name is required.");
      return;
    }
    try {
      setDataError("");
      if (isEditing) {
        await apiRequest(`/api/admin/seasons/${editingSeasonId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            name: editingSeasonName.trim(),
            start_date: editingSeasonStart || null,
            end_date: editingSeasonEnd || null,
            is_active: editingSeasonActive,
          }),
        });
      } else {
        await apiRequest("/api/admin/seasons", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            name: newSeasonName.trim(),
            start_date: newSeasonStart || null,
            end_date: newSeasonEnd || null,
            is_active: newSeasonActive,
          }),
        });
      }
      const seasonRes = await apiRequest("/api/admin/seasons", { headers: authHeaders });
      dispatch(setSeasons(seasonRes.seasons || []));
      setSeasonModalOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditSeason = (season) => {
    setEditingSeasonId(season.id);
    setEditingSeasonName(season.name || "");
    setEditingSeasonStart(season.start_date ? String(season.start_date).slice(0, 10) : "");
    setEditingSeasonEnd(season.end_date ? String(season.end_date).slice(0, 10) : "");
    setEditingSeasonActive(Boolean(season.is_active));
    setSeasonModalOpen(true);
  };

  const handleCancelEditSeason = () => {
    setEditingSeasonId(null);
    setEditingSeasonName("");
    setEditingSeasonStart("");
    setEditingSeasonEnd("");
    setEditingSeasonActive(false);
    setSeasonModalOpen(false);
  };

  const handleDeleteSeason = async (seasonId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/seasons/${seasonId}`, { method: "DELETE", headers: authHeaders });
      const seasonRes = await apiRequest("/api/admin/seasons", { headers: authHeaders });
      dispatch(setSeasons(seasonRes.seasons || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleSavePractice = async () => {
    if (!practiceForm.teamId) {
      setDataError("Select a team for this practice.");
      return;
    }
    try {
      setDataError("");
      const payload = {
        team_id: Number(practiceForm.teamId),
        contact_id: practiceForm.contactId ? Number(practiceForm.contactId) : null,
        day_of_week: practiceForm.dayOfWeek,
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
      const practicesRes = await apiRequest(`/api/admin/practices?team_id=${practiceForm.teamId}`, { headers: authHeaders });
      dispatch(setPractices(practicesRes.practices || []));
      setPracticeModalOpen(false);
      setEditingPracticeId(null);
      setPracticeForm((prev) => ({ ...emptyPractice, teamId: prev.teamId }));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditPractice = (practice) => {
    setEditingPracticeId(practice.id);
    setPracticeForm({
      teamId: practice.team_id ? String(practice.team_id) : "",
      contactId: practice.contact_id ? String(practice.contact_id) : "",
      dayOfWeek: practice.day_of_week ?? 1,
      startTime: practice.start_time?.slice(0, 5) || "15:00",
      endTime: practice.end_time?.slice(0, 5) || "17:00",
      location: practice.location || "",
      notes: practice.notes || "",
    });
    setPracticeModalOpen(true);
  };

  const handleCancelPracticeEdit = () => {
    setEditingPracticeId(null);
    setPracticeForm((prev) => ({ ...emptyPractice, teamId: prev.teamId }));
    setPracticeModalOpen(false);
  };

  const handleDeletePractice = async (practiceId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/practices/${practiceId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const practicesRes = await apiRequest(`/api/admin/practices?team_id=${selectedTeamId}`, { headers: authHeaders });
      dispatch(setPractices(practicesRes.practices || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <TeamsSection
        classes={classes}
        onAddTeam={handleOpenTeamModal}
        teamSearch={teamSearch}
        onTeamSearchChange={setTeamSearch}
        teamOrgFilter={teamOrgFilter}
        onTeamOrgFilterChange={setTeamOrgFilter}
        teamSeasonFilter={teamSeasonFilter}
        onTeamSeasonFilterChange={setTeamSeasonFilter}
        schools={organizations}
        seasons={seasons}
        filteredTeams={filteredTeams}
        onEditTeam={handleEditTeam}
        onDeleteTeam={handleDeleteTeam}
        seasonMap={seasonMap}
        teams={teams}
        practices={practices}
        selectedTeamId={selectedTeamId}
        onSelectedTeamChange={setSelectedTeamId}
        dayOptions={dayOptions}
        onAddPractice={() => {
          setEditingPracticeId(null);
          setPracticeForm((prev) => ({ ...emptyPractice, teamId: prev.teamId || selectedTeamId || "" }));
          setPracticeModalOpen(true);
        }}
        onEditPractice={handleEditPractice}
        onDeletePractice={handleDeletePractice}
        onAddSeason={() => {
          setEditingSeasonId(null);
          setEditingSeasonName("");
          setEditingSeasonStart("");
          setEditingSeasonEnd("");
          setEditingSeasonActive(false);
          setNewSeasonName("");
          setNewSeasonStart("");
          setNewSeasonEnd("");
          setNewSeasonActive(false);
          setSeasonModalOpen(true);
        }}
        onEditSeason={handleEditSeason}
        onDeleteSeason={handleDeleteSeason}
      />

      <Dialog
        open={teamModalOpen}
        onClose={() => {
          if (editingTeamId) {
            handleCancelTeamEdit();
          } else {
            setTeamModalOpen(false);
            setTeamForm(emptyTeam);
          }
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingTeamId ? "Edit Team" : "Add Team"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            select
            label="Organization (optional)"
            value={teamForm.organizationId}
            onChange={(event) =>
              setTeamForm((prev) => ({ ...prev, organizationId: event.target.value }))
            }
            sx={classes.input}
          >
            <MenuItem value="">No organization selected</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.id} value={org.id}>
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
          >
            <MenuItem value="">Default season</MenuItem>
            {seasons.map((season) => (
              <MenuItem key={season.id} value={season.id}>
                {season.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Team name"
            value={teamForm.name}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, name: event.target.value }))}
            sx={classes.input}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Sport"
              value={teamForm.sport}
              onChange={(event) => setTeamForm((prev) => ({ ...prev, sport: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "160px" }}
            />
            <TextField
              label="Level"
              value={teamForm.level}
              onChange={(event) => setTeamForm((prev) => ({ ...prev, level: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "160px" }}
            />
          </Box>
          <TextField
            label="Season"
            value={teamForm.season}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, season: event.target.value }))}
            sx={classes.input}
          />
          <TextField
            label="Location"
            value={teamForm.location}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, location: event.target.value }))}
            sx={classes.input}
          />
          <TextField
            label="Notes"
            value={teamForm.notes}
            onChange={(event) => setTeamForm((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{ color: "var(--color-text)" }}
            onClick={() => {
              if (editingTeamId) {
                handleCancelTeamEdit();
              } else {
                setTeamModalOpen(false);
                setTeamForm(emptyTeam);
              }
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveTeam}>
            {editingTeamId ? "Save Team" : "Add Team"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={seasonModalOpen}
        onClose={() => {
          if (editingSeasonId) {
            handleCancelEditSeason();
          } else {
            setSeasonModalOpen(false);
          }
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingSeasonId ? "Edit Season" : "Add Season"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            label="Season name"
            value={editingSeasonId ? editingSeasonName : newSeasonName}
            onChange={(event) =>
              editingSeasonId
                ? setEditingSeasonName(event.target.value)
                : setNewSeasonName(event.target.value)
            }
            sx={classes.input}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Start date"
              type="date"
              value={editingSeasonId ? editingSeasonStart : newSeasonStart}
              onChange={(event) =>
                editingSeasonId
                  ? setEditingSeasonStart(event.target.value)
                  : setNewSeasonStart(event.target.value)
              }
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End date"
              type="date"
              value={editingSeasonId ? editingSeasonEnd : newSeasonEnd}
              onChange={(event) =>
                editingSeasonId
                  ? setEditingSeasonEnd(event.target.value)
                  : setNewSeasonEnd(event.target.value)
              }
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={editingSeasonId ? editingSeasonActive : newSeasonActive}
              onChange={(event) =>
                editingSeasonId
                  ? setEditingSeasonActive(event.target.checked)
                  : setNewSeasonActive(event.target.checked)
              }
              sx={{
                color: "var(--color-muted)",
                "&.Mui-checked": { color: "var(--color-accent)" },
              }}
            />
            <Typography sx={{ color: "var(--color-text)" }}>Set as active season</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{ color: "var(--color-text)" }}
            onClick={() => {
              if (editingSeasonId) {
                handleCancelEditSeason();
              } else {
                setSeasonModalOpen(false);
              }
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveSeason}>
            {editingSeasonId ? "Save Season" : "Add Season"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={practiceModalOpen}
        onClose={() => {
          if (editingPracticeId) {
            handleCancelPracticeEdit();
          } else {
            setPracticeModalOpen(false);
          }
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingPracticeId ? "Edit Practice" : "Add Practice"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            select
            label="Team"
            value={practiceForm.teamId}
            onChange={(event) => setPracticeForm((prev) => ({ ...prev, teamId: event.target.value }))}
            sx={classes.input}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>
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
            {contacts.map((contact) => (
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
          <Button
            variant="outlined"
            sx={{ color: "var(--color-text)" }}
            onClick={() => {
              if (editingPracticeId) {
                handleCancelPracticeEdit();
              } else {
                setPracticeModalOpen(false);
              }
            }}
          >
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
