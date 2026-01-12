import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest, authHeader } from "./surveyApi";
import { ratingOptions, surveyQuestions } from "./surveyConfig";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

const TOKEN_KEY = "dauntlessSurveyAdminToken";

const classes = {
  page: {
    minHeight: "100vh",
    padding: { xs: "32px 0", md: "48px 0" },
    background:
      "linear-gradient(145deg, rgba(19, 22, 28, 0.96), rgba(11, 13, 16, 0.95)), radial-gradient(circle at 20% 20%, rgba(215, 38, 56, 0.24), transparent 55%)",
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

const ratingLabelMap = ratingOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

export default function SurveyAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [schools, setSchools] = useState([]);
  const [responses, setResponses] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [editingSchoolName, setEditingSchoolName] = useState("");
  const [inviteCount, setInviteCount] = useState(1);
  const [latestInvites, setLatestInvites] = useState([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState([]);
  const [dataError, setDataError] = useState("");

  const schoolOptions = useMemo(() => {
    return [{ id: "", name: "All schools" }, ...schools];
  }, [schools]);

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const loadSchools = useCallback(async () => {
    const result = await apiRequest("/api/admin/schools", { headers: authHeaders });
    setSchools(result.schools || []);
  }, [authHeaders]);

  const loadData = useCallback(
    async (schoolId) => {
      const query = schoolId ? `?school_id=${schoolId}` : "";
      const [responsesResult, invitesResult] = await Promise.all([
        apiRequest(`/api/admin/responses${query}`, { headers: authHeaders }),
        apiRequest(`/api/admin/invites${query}`, { headers: authHeaders }),
      ]);
      setResponses(responsesResult.responses || []);
      setInvites(invitesResult.invites || []);
    },
    [authHeaders]
  );

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        setDataError("");
        await loadSchools();
        await loadData(selectedSchoolId);
      } catch (error) {
        setDataError(error.message);
      }
    };
    fetchAll();
  }, [token, selectedSchoolId, loadSchools, loadData]);

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

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) {
      setDataError("Enter a school name to add.");
      return;
    }

    try {
      setDataError("");
      await apiRequest("/api/admin/schools", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ name: newSchoolName.trim() }),
      });
      setNewSchoolName("");
      await loadSchools();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleCreateInvites = async () => {
    if (!selectedSchoolId) {
      setDataError("Select a school before generating invite links.");
      return;
    }

    try {
      setDataError("");
      const result = await apiRequest("/api/admin/invites", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          school_id: Number(selectedSchoolId),
          count: Number(inviteCount),
        }),
      });
      setLatestInvites(result.invites || []);
      setSelectedInviteIds([]);
      await loadData(selectedSchoolId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditSchool = (school) => {
    setEditingSchoolId(school.id);
    setEditingSchoolName(school.name);
  };

  const handleCancelEditSchool = () => {
    setEditingSchoolId(null);
    setEditingSchoolName("");
  };

  const handleSaveSchool = async (schoolId) => {
    if (!editingSchoolName.trim()) {
      setDataError("Enter a school name to save.");
      return;
    }

    try {
      setDataError("");
      await apiRequest(`/api/admin/schools/${schoolId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ name: editingSchoolName.trim() }),
      });
      setEditingSchoolId(null);
      setEditingSchoolName("");
      await loadSchools();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/schools/${schoolId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const nextSelectedId = String(schoolId) === String(selectedSchoolId) ? "" : selectedSchoolId;
      if (nextSelectedId !== selectedSchoolId) {
        setSelectedSchoolId(nextSelectedId);
      }
      await loadSchools();
      await loadData(nextSelectedId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const getInviteText = (invite) => invite.link || invite.token;

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
    } catch (error) {
      setDataError("Unable to copy to clipboard.");
    }
  };

  const toggleInviteSelection = (inviteId) => {
    setSelectedInviteIds((prev) =>
      prev.includes(inviteId) ? prev.filter((id) => id !== inviteId) : [...prev, inviteId]
    );
  };

  const allInvitesSelected =
    latestInvites.length > 0 && selectedInviteIds.length === latestInvites.length;

  const handleToggleAllInvites = () => {
    if (allInvitesSelected) {
      setSelectedInviteIds([]);
    } else {
      setSelectedInviteIds(latestInvites.map((invite) => invite.id));
    }
  };

  const handleCopySelectedInvites = async () => {
    const selected = latestInvites.filter((invite) => selectedInviteIds.includes(invite.id));
    if (selected.length === 0) {
      setDataError("Select at least one link to copy.");
      return;
    }
    const payload = selected.map(getInviteText).filter(Boolean).join("\n");
    await copyToClipboard(payload);
  };

  const handleRegenerateInvite = async (inviteId) => {
    try {
      setDataError("");
      const result = await apiRequest(`/api/admin/invites/${inviteId}/regenerate`, {
        method: "POST",
        headers: authHeaders,
      });
      setLatestInvites(result.invites || []);
      setSelectedInviteIds([]);
      await loadData(selectedSchoolId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteInvite = async (inviteId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/invites/${inviteId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await loadData(selectedSchoolId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleReopenInvite = async (inviteId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/invites/${inviteId}/reopen`, {
        method: "POST",
        headers: authHeaders,
      });
      await loadData(selectedSchoolId);
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
            Survey Admin Dashboard
          </Typography>
          <Typography sx={{ color: "var(--color-muted)" }}>
            Confidential view with school names and invite management.
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Access Granted</Typography>
                <Button variant="outlined" onClick={handleLogout} sx={{ color: "var(--color-text)" }}>
                  Log out
                </Button>
              </Box>
              {dataError && <Alert severity="error">{dataError}</Alert>}
              <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Schools</Typography>
                <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <TextField
                    label="Add a new school"
                    value={newSchoolName}
                    onChange={(event) => setNewSchoolName(event.target.value)}
                    sx={classes.input}
                  />
                  <Button variant="contained" sx={classes.button} onClick={handleCreateSchool}>
                    Add School
                  </Button>
                </Box>
                <Select
                  value={selectedSchoolId}
                  onChange={(event) => setSelectedSchoolId(event.target.value)}
                  sx={{
                    ...classes.input,
                    minWidth: "240px",
                    color: "var(--color-text)",
                    "& .MuiSelect-icon": {
                      color: "var(--color-muted)",
                    },
                  }}
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "var(--color-surface-3)",
                        color: "var(--color-text)",
                        border: "1px solid var(--color-border)",
                      },
                    },
                    MenuListProps: {
                      sx: { color: "var(--color-text)" },
                    },
                  }}
                >
                  {schoolOptions.map((school) => (
                    <MenuItem key={school.id} value={school.id} sx={{ color: "var(--color-text)" }}>
                      {school.name}
                    </MenuItem>
                  ))}
                </Select>
                {schools.length > 0 && (
                  <Box sx={{ display: "grid", gap: "10px" }}>
                    {schools.map((school) => {
                      const isEditing = editingSchoolId === school.id;
                      return (
                        <Box
                          key={school.id}
                          sx={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {isEditing ? (
                            <TextField
                              label="School name"
                              value={editingSchoolName}
                              onChange={(event) => setEditingSchoolName(event.target.value)}
                              sx={{ ...classes.input, minWidth: "220px" }}
                            />
                          ) : (
                            <Typography sx={{ color: "var(--color-text)" }}>{school.name}</Typography>
                          )}
                          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {isEditing ? (
                              <>
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={classes.button}
                                  onClick={() => handleSaveSchool(school.id)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ color: "var(--color-text)" }}
                                  onClick={handleCancelEditSchool}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ color: "var(--color-text)" }}
                                  onClick={() => handleEditSchool(school)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ color: "var(--color-text)" }}
                                  onClick={() => handleDeleteSchool(school.id)}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>

              <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Links</Typography>
                <Typography sx={{ color: "var(--color-muted)" }}>
                  Generate unique links per coach. Copy them now — they won’t be shown again.
                </Typography>
                <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <TextField
                    label="Count"
                    type="number"
                    value={inviteCount}
                    onChange={(event) => setInviteCount(event.target.value)}
                    sx={{ ...classes.input, maxWidth: "120px" }}
                    inputProps={{ min: 1, max: 50 }}
                  />
                  <Button variant="contained" sx={classes.button} onClick={handleCreateInvites}>
                    Generate Links
                  </Button>
                </Box>
                {latestInvites.length > 0 && (
                  <Box sx={{ display: "grid", gap: "10px" }}>
                    <Box sx={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <Checkbox
                        checked={allInvitesSelected}
                        onChange={handleToggleAllInvites}
                        sx={{
                          color: "var(--color-muted)",
                          "&.Mui-checked": { color: "var(--color-accent)" },
                        }}
                      />
                      <Typography sx={{ color: "var(--color-text)" }}>Select all</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: "var(--color-text)" }}
                        onClick={handleCopySelectedInvites}
                      >
                        Copy selected
                      </Button>
                    </Box>
                    {latestInvites.map((invite) => {
                      const inviteText = getInviteText(invite);
                      return (
                        <Box
                          key={invite.id}
                          onClick={() => copyToClipboard(inviteText)}
                          sx={{
                            display: "grid",
                            gap: "6px",
                            padding: "12px 14px",
                            borderRadius: "12px",
                            backgroundColor: "var(--color-surface-3)",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text)",
                            cursor: "pointer",
                          }}
                        >
                          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Checkbox
                              checked={selectedInviteIds.includes(invite.id)}
                              onChange={() => toggleInviteSelection(invite.id)}
                              onClick={(event) => event.stopPropagation()}
                              sx={{
                                color: "var(--color-muted)",
                                "&.Mui-checked": { color: "var(--color-accent)" },
                              }}
                            />
                            <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                              Click to copy
                            </Typography>
                          </Box>
                          <Typography sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                            {inviteText}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Box>

              <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Status</Typography>
                {invites.length === 0 ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>No invite links yet.</Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: "8px" }}>
                    {invites.map((invite) => (
                      <Box
                        key={invite.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography sx={{ color: "var(--color-text)" }}>{invite.school_name}</Typography>
                        <Box sx={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                          <Typography sx={{ color: invite.used_at ? "var(--color-accent)" : "var(--color-muted)" }}>
                            {invite.used_at ? `Used ${formatDate(invite.used_at)}` : "Unused"}
                          </Typography>
                          {!invite.used_at && (
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ color: "var(--color-text)" }}
                              onClick={() => handleRegenerateInvite(invite.id)}
                            >
                              Resend Link
                            </Button>
                          )}
                          {invite.used_at && (
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{ color: "var(--color-text)" }}
                              onClick={() => handleReopenInvite(invite.id)}
                            >
                              Reopen
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: "var(--color-text)" }}
                            onClick={() => handleDeleteInvite(invite.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider />

              <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Responses</Typography>
                {responses.length === 0 ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>No responses yet.</Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: "16px" }}>
                    {responses.map((response) => (
                      <Paper key={response.id} sx={{ ...classes.section, backgroundColor: "var(--color-surface-3)" }}>
                        <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                          {response.school_name}
                        </Typography>
                        <Typography sx={{ color: "var(--color-muted)" }}>{formatDate(response.created_at)}</Typography>
                        <Divider sx={{ borderColor: "var(--color-border)" }} />
                        {surveyQuestions.map((question) => (
                          <Box key={question.key} sx={{ display: "grid", gap: "4px" }}>
                            <Typography sx={{ fontSize: "0.95rem", color: "var(--color-text)" }}>
                              {question.text}
                            </Typography>
                            <Typography sx={{ color: "var(--color-accent)" }}>
                              {ratingLabelMap[response[question.key]] || response[question.key]}
                            </Typography>
                          </Box>
                        ))}
                        {response.comment && (
                          <Box>
                            <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                              Comments
                            </Typography>
                            <Typography sx={{ color: "var(--color-muted)" }}>{response.comment}</Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
