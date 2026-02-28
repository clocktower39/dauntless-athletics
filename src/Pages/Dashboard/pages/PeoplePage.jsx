import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
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
import PeopleSection from "../../../Components/Dashboard/PeopleSection";
import classes from "../dashboardStyles";
import { audienceOptions, emptyContact } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setCoaches, setContacts, setSeasons, setTeams } from "../../../store/dashboardSlice";

const emptyCoach = { name: "", email: "", phone: "" };

export default function PeoplePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const teams = useSelector((state) => state.dashboard.teams);
  const seasons = useSelector((state) => state.dashboard.seasons);
  const coaches = useSelector((state) => state.dashboard.coaches);
  const contacts = useSelector((state) => state.dashboard.contacts);
  const [dataError, setDataError] = useState("");
  const [peopleView, setPeopleView] = useState("coaches");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [assignCoachModalOpen, setAssignCoachModalOpen] = useState(false);
  const [coachForm, setCoachForm] = useState(emptyCoach);
  const [editingCoachId, setEditingCoachId] = useState(null);
  const [contactForm, setContactForm] = useState(emptyContact);
  const [editingContactId, setEditingContactId] = useState(null);
  const [assignCoachId, setAssignCoachId] = useState(null);
  const [assignTeamId, setAssignTeamId] = useState("");
  const [assignSeasonId, setAssignSeasonId] = useState("");
  const [assignCoachRole, setAssignCoachRole] = useState("");
  const [coachAssignments, setCoachAssignments] = useState([]);

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const filteredCoaches = useMemo(() => {
    const term = peopleSearch.trim().toLowerCase();
    if (!term) return coaches;
    return coaches.filter((coach) =>
      [coach.name, coach.email, coach.phone].some((field) =>
        String(field || "").toLowerCase().includes(term)
      )
    );
  }, [coaches, peopleSearch]);

  const filteredContacts = useMemo(() => {
    const term = peopleSearch.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) =>
      [contact.name, contact.role, contact.audience, contact.email, contact.phone]
        .some((field) => String(field || "").toLowerCase().includes(term))
    );
  }, [contacts, peopleSearch]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [coachRes, teamRes, seasonRes] = await Promise.all([
          apiRequest("/api/admin/coaches", { headers: authHeaders }),
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/seasons", { headers: authHeaders }),
        ]);
        dispatch(setCoaches(coachRes.coaches || []));
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
      return;
    }
    const loadContacts = async () => {
      try {
        const result = await apiRequest(`/api/admin/contacts?team_id=${selectedTeamId}`, {
          headers: authHeaders,
        });
        dispatch(setContacts(result.contacts || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadContacts();
  }, [selectedTeamId, authHeaders, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newParam = params.get("new");
    if (newParam === "coach") {
      setPeopleView("coaches");
      handleOpenCoachModal();
    }
    if (newParam === "contact") {
      setPeopleView("contacts");
      handleOpenContactModal();
    }
  }, [location.search]);

  const handleOpenCoachModal = (coach = null) => {
    if (coach) {
      setEditingCoachId(coach.id);
      setCoachForm({
        name: coach.name || "",
        email: coach.email || "",
        phone: coach.phone || "",
      });
    } else {
      setEditingCoachId(null);
      setCoachForm(emptyCoach);
    }
    setCoachModalOpen(true);
  };

  const handleSaveCoach = async () => {
    if (!coachForm.name.trim()) {
      setDataError("Coach name is required.");
      return;
    }
    try {
      setDataError("");
      if (editingCoachId) {
        await apiRequest(`/api/admin/coaches/${editingCoachId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            name: coachForm.name.trim(),
            email: coachForm.email.trim(),
            phone: coachForm.phone.trim(),
          }),
        });
      } else {
        await apiRequest("/api/admin/coaches", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            name: coachForm.name.trim(),
            email: coachForm.email.trim(),
            phone: coachForm.phone.trim(),
          }),
        });
      }
      const result = await apiRequest("/api/admin/coaches", { headers: authHeaders });
      dispatch(setCoaches(result.coaches || []));
      setCoachModalOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteCoach = async (coachId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/coaches/${coachId}`, { method: "DELETE", headers: authHeaders });
      const result = await apiRequest("/api/admin/coaches", { headers: authHeaders });
      dispatch(setCoaches(result.coaches || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleOpenContactModal = (contact = null) => {
    if (contact) {
      setEditingContactId(contact.id);
      setContactForm({
        teamId: contact.team_id ? String(contact.team_id) : "",
        name: contact.name || "",
        role: contact.role || "",
        audience: contact.audience || "Coach",
        email: contact.email || "",
        phone: contact.phone || "",
        notes: contact.notes || "",
      });
    } else {
      setEditingContactId(null);
      setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId || selectedTeamId || "" }));
    }
    setContactModalOpen(true);
  };

  const handleSaveContact = async () => {
    if (!contactForm.teamId) {
      setDataError("Select a team for this contact.");
      return;
    }
    if (!contactForm.name.trim()) {
      setDataError("Contact name is required.");
      return;
    }
    try {
      setDataError("");
      const payload = {
        team_id: Number(contactForm.teamId),
        name: contactForm.name.trim(),
        role: contactForm.role.trim(),
        audience: contactForm.audience,
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        notes: contactForm.notes.trim(),
      };
      if (editingContactId) {
        await apiRequest(`/api/admin/contacts/${editingContactId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/admin/contacts", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      const result = await apiRequest(`/api/admin/contacts?team_id=${contactForm.teamId}`, {
        headers: authHeaders,
      });
      dispatch(setContacts(result.contacts || []));
      setContactModalOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/contacts/${contactId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (selectedTeamId) {
        const result = await apiRequest(`/api/admin/contacts?team_id=${selectedTeamId}`, {
          headers: authHeaders,
        });
        dispatch(setContacts(result.contacts || []));
      }
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleOpenAssignCoach = async (coach) => {
    setAssignCoachId(coach.id);
    setAssignTeamId("");
    setAssignSeasonId("");
    setAssignCoachRole("");
    setAssignCoachModalOpen(true);
    try {
      const result = await apiRequest(`/api/admin/coach-teams?coach_id=${coach.id}`, { headers: authHeaders });
      setCoachAssignments(result.assignments || []);
    } catch (error) {
      setCoachAssignments([]);
      setDataError(error.message);
    }
  };

  const handleAssignCoach = async () => {
    if (!assignCoachId || !assignTeamId) {
      setDataError("Select a coach and team to assign.");
      return;
    }
    try {
      setDataError("");
      await apiRequest("/api/admin/coach-teams", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          coach_id: assignCoachId,
          team_id: Number(assignTeamId),
          season_id: assignSeasonId ? Number(assignSeasonId) : null,
          role: assignCoachRole.trim(),
        }),
      });
      const result = await apiRequest(`/api/admin/coach-teams?coach_id=${assignCoachId}`, { headers: authHeaders });
      setCoachAssignments(result.assignments || []);
      const coachRes = await apiRequest("/api/admin/coaches", { headers: authHeaders });
      dispatch(setCoaches(coachRes.coaches || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleRemoveCoachAssignment = async (assignment) => {
    try {
      setDataError("");
      await apiRequest("/api/admin/coach-teams", {
        method: "DELETE",
        headers: authHeaders,
        body: JSON.stringify({
          coach_id: assignment.coach_id,
          team_id: assignment.team_id,
          season_id: assignment.season_id,
        }),
      });
      const result = await apiRequest(`/api/admin/coach-teams?coach_id=${assignment.coach_id}`, { headers: authHeaders });
      setCoachAssignments(result.assignments || []);
      const coachRes = await apiRequest("/api/admin/coaches", { headers: authHeaders });
      dispatch(setCoaches(coachRes.coaches || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <PeopleSection
        classes={classes}
        peopleView={peopleView}
        onPeopleViewChange={setPeopleView}
        peopleSearch={peopleSearch}
        onPeopleSearchChange={setPeopleSearch}
        teams={teams}
        selectedTeamId={selectedTeamId}
        onSelectedTeamChange={setSelectedTeamId}
        onAddCoach={() => handleOpenCoachModal()}
        onAddContact={() => handleOpenContactModal()}
        filteredCoaches={filteredCoaches}
        filteredContacts={filteredContacts}
        onAssignCoach={handleOpenAssignCoach}
        onEditCoach={handleOpenCoachModal}
        onDeleteCoach={handleDeleteCoach}
        onEditContact={handleOpenContactModal}
        onDeleteContact={handleDeleteContact}
      />

      <Dialog
        open={coachModalOpen}
        onClose={() => {
          setCoachModalOpen(false);
          setEditingCoachId(null);
          setCoachForm(emptyCoach);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingCoachId ? "Edit Coach" : "Add Coach"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            label="Coach name"
            value={coachForm.name}
            onChange={(event) => setCoachForm((prev) => ({ ...prev, name: event.target.value }))}
            sx={classes.input}
          />
          <TextField
            label="Email"
            value={coachForm.email}
            onChange={(event) => setCoachForm((prev) => ({ ...prev, email: event.target.value }))}
            sx={classes.input}
          />
          <TextField
            label="Phone"
            value={coachForm.phone}
            onChange={(event) => setCoachForm((prev) => ({ ...prev, phone: event.target.value }))}
            sx={classes.input}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setCoachModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveCoach}>
            {editingCoachId ? "Save Coach" : "Add Coach"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={assignCoachModalOpen}
        onClose={() => setAssignCoachModalOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Assign Coach to Team
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <Box sx={{ display: "grid", gap: "12px" }}>
            <TextField
              select
              label="Team"
              value={assignTeamId}
              onChange={(event) => setAssignTeamId(event.target.value)}
              sx={classes.input}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Season (optional)"
              value={assignSeasonId}
              onChange={(event) => setAssignSeasonId(event.target.value)}
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
              label="Role (optional)"
              value={assignCoachRole}
              onChange={(event) => setAssignCoachRole(event.target.value)}
              sx={classes.input}
            />
            <Button variant="contained" sx={classes.button} onClick={handleAssignCoach}>
              Assign Coach
            </Button>
          </Box>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Current Assignments</Typography>
          {coachAssignments.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>No assignments yet.</Typography>
          ) : (
            <Box sx={{ display: "grid", gap: "8px" }}>
              {coachAssignments.map((assignment) => (
                <Box
                  key={`${assignment.coach_id}-${assignment.team_id}-${assignment.season_id || "0"}`}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface-2)",
                  }}
                >
                  <Box>
                    <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {assignment.team_name}
                    </Typography>
                    <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                      {assignment.season_name || "Default season"} {assignment.role ? `• ${assignment.role}` : ""}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "var(--color-text)" }}
                    onClick={() => handleRemoveCoachAssignment(assignment)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setAssignCoachModalOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={contactModalOpen}
        onClose={() => {
          if (editingContactId) {
            setEditingContactId(null);
          }
          setContactModalOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingContactId ? "Edit Contact" : "Add Contact"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            select
            label="Team"
            value={contactForm.teamId}
            onChange={(event) => setContactForm((prev) => ({ ...prev, teamId: event.target.value }))}
            sx={classes.input}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Contact name"
            value={contactForm.name}
            onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
            sx={classes.input}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Role / Title"
              value={contactForm.role}
              onChange={(event) => setContactForm((prev) => ({ ...prev, role: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              select
              label="Audience"
              value={contactForm.audience}
              onChange={(event) => setContactForm((prev) => ({ ...prev, audience: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            >
              {audienceOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Email"
              value={contactForm.email}
              onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              label="Phone"
              value={contactForm.phone}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phone: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
          </Box>
          <TextField
            label="Notes"
            value={contactForm.notes}
            onChange={(event) => setContactForm((prev) => ({ ...prev, notes: event.target.value }))}
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
              if (editingContactId) {
                setEditingContactId(null);
              }
              setContactModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveContact}>
            {editingContactId ? "Save Contact" : "Add Contact"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
