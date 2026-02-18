import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest, authHeader } from "../Survey/surveyApi";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

const TOKEN_KEY = "dauntlessSurveyAdminToken";

const classes = {
  page: {
    minHeight: "100vh",
    padding: { xs: "32px 0", md: "48px 0" },
    background:
      "linear-gradient(160deg, rgba(13, 17, 23, 0.98), rgba(11, 13, 16, 0.96)), radial-gradient(circle at 20% 20%, rgba(215, 38, 56, 0.2), transparent 55%)",
    "--color-text": "#ffffff",
    "--color-muted": "#d5deea",
    "--color-border": "rgba(255, 255, 255, 0.18)",
  },
  card: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "24px",
    padding: { xs: "20px", md: "28px" },
    boxShadow: "0 28px 55px rgba(0,0,0,0.45)",
    display: "grid",
    gap: "16px",
  },
  section: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: "18px",
    display: "grid",
    gap: "12px",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface-3)",
      color: "var(--color-text)",
      borderRadius: "12px",
      "& fieldset": {
        borderColor: "var(--color-border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--color-accent)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-accent)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--color-muted)",
    },
  },
  button: {
    backgroundColor: "var(--color-accent)",
    borderRadius: "999px",
    padding: "10px 24px",
    "&:hover": {
      backgroundColor: "var(--color-accent-2)",
    },
  },
};

const emptyTeam = {
  schoolId: "",
  name: "",
  sport: "",
  level: "",
  season: "",
  location: "",
  notes: "",
};

const emptyContact = {
  teamId: "",
  name: "",
  role: "",
  audience: "Coach",
  email: "",
  phone: "",
  notes: "",
};

const audienceOptions = ["Coach", "Athlete", "Parent", "Staff", "Other"];

export default function ContactsAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [schools, setSchools] = useState([]);
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [contactForm, setContactForm] = useState(emptyContact);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingContactId, setEditingContactId] = useState(null);
  const [dataError, setDataError] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const loadSchools = useCallback(async () => {
    const result = await apiRequest("/api/admin/schools", { headers: authHeaders });
    setSchools(result.schools || []);
  }, [authHeaders]);

  const loadTeams = useCallback(async () => {
    const result = await apiRequest("/api/admin/teams", { headers: authHeaders });
    setTeams(result.teams || []);
  }, [authHeaders]);

  const loadContacts = useCallback(
    async (teamId) => {
      if (!teamId) {
        setContacts([]);
        return;
      }
      const result = await apiRequest(`/api/admin/contacts?team_id=${teamId}`, {
        headers: authHeaders,
      });
      setContacts(result.contacts || []);
    },
    [authHeaders]
  );

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        setDataError("");
        await loadSchools();
        await loadTeams();
      } catch (error) {
        setDataError(error.message);
      }
    };
    fetchAll();
  }, [token, loadSchools, loadTeams]);

  useEffect(() => {
    if (!selectedTeamId && teams.length > 0) {
      setSelectedTeamId(String(teams[0].id));
    }
  }, [selectedTeamId, teams]);

  useEffect(() => {
    if (!token) return;
    loadContacts(selectedTeamId);
  }, [token, selectedTeamId, loadContacts]);

  useEffect(() => {
    if (!editingContactId) {
      setContactForm((prev) => ({ ...prev, teamId: selectedTeamId || "" }));
    }
  }, [selectedTeamId, editingContactId]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setLoginError("");
    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      if (result.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setLogin({ username: "", password: "" });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  };

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) {
      setDataError("Team name is required.");
      return;
    }

    try {
      setDataError("");
      if (editingTeamId) {
        await apiRequest(`/api/admin/teams/${editingTeamId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            school_id: teamForm.schoolId ? Number(teamForm.schoolId) : null,
            name: teamForm.name.trim(),
            sport: teamForm.sport.trim(),
            level: teamForm.level.trim(),
            season: teamForm.season.trim(),
            location: teamForm.location.trim(),
            notes: teamForm.notes.trim(),
          }),
        });
      } else {
        await apiRequest("/api/admin/teams", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            school_id: teamForm.schoolId ? Number(teamForm.schoolId) : null,
            name: teamForm.name.trim(),
            sport: teamForm.sport.trim(),
            level: teamForm.level.trim(),
            season: teamForm.season.trim(),
            location: teamForm.location.trim(),
            notes: teamForm.notes.trim(),
          }),
        });
      }
      setTeamForm(emptyTeam);
      setEditingTeamId(null);
      await loadTeams();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeamId(team.id);
    setTeamForm({
      schoolId: team.school_id ? String(team.school_id) : "",
      name: team.name || "",
      sport: team.sport || "",
      level: team.level || "",
      season: team.season || "",
      location: team.location || "",
      notes: team.notes || "",
    });
  };

  const handleCancelTeamEdit = () => {
    setEditingTeamId(null);
    setTeamForm(emptyTeam);
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/teams/${teamId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const nextSelectedId = String(teamId) === String(selectedTeamId) ? "" : selectedTeamId;
      if (nextSelectedId !== selectedTeamId) {
        setSelectedTeamId(nextSelectedId);
      }
      await loadTeams();
    } catch (error) {
      setDataError(error.message);
    }
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
      if (editingContactId) {
        await apiRequest(`/api/admin/contacts/${editingContactId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            team_id: Number(contactForm.teamId),
            name: contactForm.name.trim(),
            role: contactForm.role.trim(),
            audience: contactForm.audience.trim(),
            email: contactForm.email.trim(),
            phone: contactForm.phone.trim(),
            notes: contactForm.notes.trim(),
          }),
        });
      } else {
        await apiRequest("/api/admin/contacts", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            team_id: Number(contactForm.teamId),
            name: contactForm.name.trim(),
            role: contactForm.role.trim(),
            audience: contactForm.audience.trim(),
            email: contactForm.email.trim(),
            phone: contactForm.phone.trim(),
            notes: contactForm.notes.trim(),
          }),
        });
      }
      setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId }));
      setEditingContactId(null);
      await loadContacts(contactForm.teamId);
      await loadTeams();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.id);
    setContactForm({
      teamId: String(contact.team_id),
      name: contact.name || "",
      role: contact.role || "",
      audience: contact.audience || "Coach",
      email: contact.email || "",
      phone: contact.phone || "",
      notes: contact.notes || "",
    });
  };

  const handleCancelContactEdit = () => {
    setEditingContactId(null);
    setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId }));
  };

  const handleDeleteContact = async (contactId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/contacts/${contactId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await loadContacts(selectedTeamId);
      await loadTeams();
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={classes.page}>
      <Container maxWidth="lg" sx={{ display: "grid", gap: "20px" }}>
        <Paper sx={classes.card}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={DauntlessAthleticsLogoDesktopCircleImg}
              alt="Dauntless Athletics Logo"
              sx={{ width: 72, height: 72 }}
            />
          </Box>
          <Typography
            sx={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-text)" }}
          >
            Contacts Admin
          </Typography>
          <Typography sx={{ color: "var(--color-muted)" }}>
            Keep team details and contact lists for coaches, athletes, and parents.
          </Typography>

          {!token && (
            <Box component="form" onSubmit={handleLogin} sx={classes.section}>
              <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Admin Login</Typography>
              <TextField
                label="Username"
                value={login.username}
                onChange={(event) => setLogin((prev) => ({ ...prev, username: event.target.value }))}
                sx={classes.input}
              />
              <TextField
                label="Password"
                type="password"
                value={login.password}
                onChange={(event) => setLogin((prev) => ({ ...prev, password: event.target.value }))}
                sx={classes.input}
              />
              {loginError && <Alert severity="error">{loginError}</Alert>}
              <Button type="submit" variant="contained" sx={classes.button} disabled={authLoading}>
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          )}

          {token && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Access Granted</Typography>
                <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Button
                    component={Link}
                    to="/dashboard/contacts"
                    variant="outlined"
                    sx={{ color: "var(--color-text)" }}
                  >
                    Dashboard
                  </Button>
                  <Button variant="outlined" onClick={handleLogout} sx={{ color: "var(--color-text)" }}>
                    Log out
                  </Button>
                </Box>
              </Box>
              {dataError && <Alert severity="error">{dataError}</Alert>}

              <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Teams</Typography>
                <Box sx={{ display: "grid", gap: "12px" }}>
                  <TextField
                    select
                    label="School (optional)"
                    value={teamForm.schoolId}
                    onChange={(event) => setTeamForm((prev) => ({ ...prev, schoolId: event.target.value }))}
                    sx={classes.input}
                  >
                    <MenuItem value="">No school selected</MenuItem>
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
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
                      sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                    />
                    <TextField
                      label="Level"
                      value={teamForm.level}
                      onChange={(event) => setTeamForm((prev) => ({ ...prev, level: event.target.value }))}
                      sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                    />
                    <TextField
                      label="Season"
                      value={teamForm.season}
                      onChange={(event) => setTeamForm((prev) => ({ ...prev, season: event.target.value }))}
                      sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                    />
                  </Box>
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
                  <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <Button variant="contained" sx={classes.button} onClick={handleSaveTeam}>
                      {editingTeamId ? "Save Team" : "Add Team"}
                    </Button>
                    {editingTeamId && (
                      <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleCancelTeamEdit}>
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>

                {teams.length > 0 && (
                  <Box sx={{ display: "grid", gap: "10px" }}>
                    {teams.map((team) => (
                      <Box
                        key={team.id}
                        sx={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: "220px" }}>
                          <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                            {team.name}
                          </Typography>
                          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                            {team.school_name || "No school"} · {team.contact_count || 0} contacts
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: "var(--color-text)" }}
                            onClick={() => handleEditTeam(team)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: "var(--color-text)" }}
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Contacts</Typography>
                {teams.length === 0 ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>
                    Add a team first to start collecting contacts.
                  </Typography>
                ) : (
                  <>
                    <TextField
                      select
                      label="Team"
                      value={selectedTeamId}
                      onChange={(event) => setSelectedTeamId(event.target.value)}
                      sx={classes.input}
                    >
                      {teams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Divider sx={{ borderColor: "var(--color-border)" }} />
                    <Box sx={{ display: "grid", gap: "12px" }}>
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
                          sx={{ ...classes.input, flex: 1, minWidth: "200px" }}
                        />
                        <TextField
                          select
                          label="Audience"
                          value={contactForm.audience}
                          onChange={(event) => setContactForm((prev) => ({ ...prev, audience: event.target.value }))}
                          sx={{ ...classes.input, flex: 1, minWidth: "160px" }}
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
                          sx={{ ...classes.input, flex: 1, minWidth: "220px" }}
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
                      <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <Button variant="contained" sx={classes.button} onClick={handleSaveContact}>
                          {editingContactId ? "Save Contact" : "Add Contact"}
                        </Button>
                        {editingContactId && (
                          <Button
                            variant="outlined"
                            sx={{ color: "var(--color-text)" }}
                            onClick={handleCancelContactEdit}
                          >
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {contacts.length === 0 ? (
                      <Typography sx={{ color: "var(--color-muted)" }}>No contacts yet.</Typography>
                    ) : (
                      <Box sx={{ display: "grid", gap: "10px" }}>
                        {contacts.map((contact) => (
                          <Box
                            key={contact.id}
                            sx={{
                              display: "flex",
                              gap: "12px",
                              alignItems: "center",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: "220px" }}>
                              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                                {contact.name}
                              </Typography>
                              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
                                {(contact.role && `${contact.role} · `) || ""}
                                {contact.audience || "Contact"}
                              </Typography>
                              {(contact.email || contact.phone) && (
                                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                                  {contact.email || "No email"} · {contact.phone || "No phone"}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ color: "var(--color-text)" }}
                                onClick={() => handleEditContact(contact)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ color: "var(--color-text)" }}
                                onClick={() => handleDeleteContact(contact.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
