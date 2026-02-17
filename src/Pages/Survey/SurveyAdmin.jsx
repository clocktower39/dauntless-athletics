import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { apiRequest, authHeader } from "./surveyApi";
import { ratingOptions } from "./surveyConfig";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

const TOKEN_KEY = "dauntlessSurveyAdminToken";
const drawerWidth = 240;

const classes = {
  page: {
    minHeight: "100vh",
    padding: 0,
    display: "flex",
    background:
      "linear-gradient(145deg, rgba(19, 22, 28, 0.96), rgba(11, 13, 16, 0.95)), radial-gradient(circle at 20% 20%, rgba(215, 38, 56, 0.24), transparent 55%)",
    "--color-text": "#ffffff",
    "--color-muted": "#d5deea",
    "--color-border": "rgba(255, 255, 255, 0.18)",
  },
  content: {
    flex: 1,
    padding: { xs: "24px 16px", md: "36px 32px" },
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      borderRight: "1px solid var(--color-border)",
      padding: "16px",
      boxSizing: "border-box",
    },
  },
  card: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "24px",
    padding: { xs: "20px", md: "28px" },
    boxShadow: "0 28px 55px rgba(0,0,0,0.45)",
    display: "grid",
    gap: "14px",
  },
  section: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: "16px",
    display: "grid",
    gap: "10px",
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
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [schools, setSchools] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [newSurveyDescription, setNewSurveyDescription] = useState("");
  const [newSurveyCommentPrompt, setNewSurveyCommentPrompt] = useState("");
  const [newSurveyQuestions, setNewSurveyQuestions] = useState([{ text: "" }]);
  const [editSurveyQuestions, setEditSurveyQuestions] = useState([{ text: "" }]);
  const [editingSurveyId, setEditingSurveyId] = useState(null);
  const [editSurveyTitle, setEditSurveyTitle] = useState("");
  const [editSurveyDescription, setEditSurveyDescription] = useState("");
  const [editSurveyCommentPrompt, setEditSurveyCommentPrompt] = useState("");
  const [editSurveyActive, setEditSurveyActive] = useState(true);
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [editingSchoolName, setEditingSchoolName] = useState("");
  const [inviteCount, setInviteCount] = useState(1);
  const [latestInvites, setLatestInvites] = useState([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState([]);
  const [dataError, setDataError] = useState("");
  const [responseDetail, setResponseDetail] = useState(null);

  const schoolOptions = useMemo(() => {
    return [{ id: "", name: "All schools" }, ...schools];
  }, [schools]);

  const inviteSchoolOptions = useMemo(() => {
    return [{ id: "", name: "Select school" }, ...schools];
  }, [schools]);

  const inviteSurveyOptions = useMemo(() => {
    return [{ id: "", title: "Select survey" }, ...surveys];
  }, [surveys]);

  const authHeaders = useMemo(() => authHeader(token), [token]);
  const selectedSurvey = useMemo(
    () => surveys.find((survey) => String(survey.id) === String(selectedSurveyId)) || null,
    [surveys, selectedSurveyId]
  );

  const activeSection = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "survey-admin") return "surveys";
    return parts[1] || "surveys";
  }, [location.pathname]);

  const navItems = useMemo(
    () => [
      { id: "surveys", label: "Surveys" },
      { id: "schools", label: "Schools" },
      { id: "invites", label: "Invites" },
      { id: "responses", label: "Responses" },
    ],
    []
  );

  const activeLabel = useMemo(() => {
    const match = navItems.find((item) => item.id === activeSection);
    return match ? match.label : "Surveys";
  }, [navItems, activeSection]);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box sx={{ display: "grid", gap: "16px", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar
          src={DauntlessAthleticsLogoDesktopCircleImg}
          alt="Dauntless Athletics Logo"
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Survey Admin
          </Typography>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Dauntless Athletics
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "var(--color-border)" }} />
      {token ? (
        <List sx={{ display: "grid", gap: "6px" }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.id}
              component={Link}
              to={`/survey-admin/${item.id}`}
              onClick={() => setMobileOpen(false)}
              selected={activeSection === item.id}
              sx={{
                borderRadius: "12px",
                color: "var(--color-text)",
                "&.Mui-selected": {
                  backgroundColor: "var(--color-surface-2)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "var(--color-surface-3)",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography sx={{ color: "var(--color-muted)" }}>Sign in to access admin tools.</Typography>
      )}
      <Box sx={{ marginTop: "auto", display: "grid", gap: "8px" }}>
        {token && (
          <>
            <Button
              component={Link}
              to="/contacts-admin"
              variant="outlined"
              sx={{ color: "var(--color-text)" }}
              onClick={() => setMobileOpen(false)}
            >
              Contacts
            </Button>
            <Button variant="outlined" onClick={handleLogout} sx={{ color: "var(--color-text)" }}>
              Log out
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  const loadSchools = useCallback(async () => {
    const result = await apiRequest("/api/admin/schools", { headers: authHeaders });
    setSchools(result.schools || []);
  }, [authHeaders]);

  const loadSurveys = useCallback(async () => {
    const result = await apiRequest("/api/admin/surveys", { headers: authHeaders });
    setSurveys(result.surveys || []);
  }, [authHeaders]);

  const loadData = useCallback(
    async (schoolId, surveyId) => {
      const params = [];
      if (schoolId) params.push(`school_id=${schoolId}`);
      if (surveyId) params.push(`survey_id=${surveyId}`);
      const query = params.length > 0 ? `?${params.join("&")}` : "";
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
    if (!selectedSurveyId && surveys.length > 0) {
      setSelectedSurveyId(String(surveys[0].id));
    }
  }, [selectedSurveyId, surveys]);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        setDataError("");
        await loadSchools();
        await loadSurveys();
        await loadData(selectedSchoolId, selectedSurveyId);
      } catch (error) {
        setDataError(error.message);
      }
    };
    fetchAll();
  }, [token, selectedSchoolId, selectedSurveyId, loadSchools, loadSurveys, loadData]);

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

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

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

  const handleAddSurveyQuestion = () => {
    setNewSurveyQuestions((prev) => [...prev, { text: "" }]);
  };

  const handleUpdateSurveyQuestion = (index, value) => {
    setNewSurveyQuestions((prev) =>
      prev.map((question, idx) => (idx === index ? { ...question, text: value } : question))
    );
  };

  const handleRemoveSurveyQuestion = (index) => {
    setNewSurveyQuestions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleCreateSurvey = async () => {
    if (!newSurveyTitle.trim()) {
      setDataError("Enter a survey title to add.");
      return;
    }

    const questions = newSurveyQuestions
      .map((question) => question.text.trim())
      .filter(Boolean)
      .map((text) => ({ text }));

    if (questions.length === 0) {
      setDataError("Add at least one survey question.");
      return;
    }

    try {
      setDataError("");
      const result = await apiRequest("/api/admin/surveys", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: newSurveyTitle.trim(),
          description: newSurveyDescription.trim(),
          commentPrompt: newSurveyCommentPrompt.trim(),
          questions,
        }),
      });
      setNewSurveyTitle("");
      setNewSurveyDescription("");
      setNewSurveyCommentPrompt("");
      setNewSurveyQuestions([{ text: "" }]);
      await loadSurveys();
      if (result?.survey?.id) {
        setSelectedSurveyId(String(result.survey.id));
      }
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleAddEditSurveyQuestion = () => {
    setEditSurveyQuestions((prev) => [...prev, { text: "" }]);
  };

  const handleUpdateEditSurveyQuestion = (index, value) => {
    setEditSurveyQuestions((prev) =>
      prev.map((question, idx) => (idx === index ? { ...question, text: value } : question))
    );
  };

  const handleRemoveEditSurveyQuestion = (index) => {
    setEditSurveyQuestions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleStartEditSurvey = (survey) => {
    setEditingSurveyId(survey.id);
    setSelectedSurveyId(String(survey.id));
    setEditSurveyTitle(survey.title || "");
    setEditSurveyDescription(survey.description || "");
    setEditSurveyCommentPrompt(survey.commentPrompt || "");
    setEditSurveyActive(Boolean(survey.isActive));
    const nextQuestions = (survey.questions || []).map((question) => ({
      text: question.text || "",
    }));
    setEditSurveyQuestions(nextQuestions.length > 0 ? nextQuestions : [{ text: "" }]);
  };

  const handleCancelEditSurvey = () => {
    setEditingSurveyId(null);
    setEditSurveyTitle("");
    setEditSurveyDescription("");
    setEditSurveyCommentPrompt("");
    setEditSurveyActive(true);
    setEditSurveyQuestions([{ text: "" }]);
  };

  const handleSaveSurveyEdits = async () => {
    if (!editingSurveyId) {
      setDataError("Select a survey to edit.");
      return;
    }

    if (!editSurveyTitle.trim()) {
      setDataError("Survey title is required.");
      return;
    }

    const questions = editSurveyQuestions
      .map((question) => question.text.trim())
      .filter(Boolean)
      .map((text) => ({ text }));

    if (questions.length === 0) {
      setDataError("Add at least one survey question.");
      return;
    }

    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${editingSurveyId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          title: editSurveyTitle.trim(),
          description: editSurveyDescription.trim(),
          commentPrompt: editSurveyCommentPrompt.trim(),
          isActive: editSurveyActive,
        }),
      });
      try {
        await apiRequest(`/api/admin/surveys/${editingSurveyId}/questions`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({ questions }),
        });
      } catch (error) {
        setDataError(error.message);
      }
      await loadSurveys();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleToggleSurveyActive = async (survey) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${survey.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ isActive: !survey.isActive }),
      });
      await loadSurveys();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${surveyId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (String(surveyId) === String(editingSurveyId)) {
        handleCancelEditSurvey();
      }
      const nextSelectedId = String(surveyId) === String(selectedSurveyId) ? "" : selectedSurveyId;
      if (nextSelectedId !== selectedSurveyId) {
        setSelectedSurveyId(nextSelectedId);
      }
      await loadSurveys();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleCreateInvites = async () => {
    if (!selectedSchoolId) {
      setDataError("Select a school before generating invite links.");
      return;
    }
    if (!selectedSurveyId) {
      setDataError("Select a survey before generating invite links.");
      return;
    }

    try {
      setDataError("");
      const result = await apiRequest("/api/admin/invites", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          school_id: Number(selectedSchoolId),
          survey_id: Number(selectedSurveyId),
          count: Number(inviteCount),
        }),
      });
      setLatestInvites(result.invites || []);
      setSelectedInviteIds([]);
      await loadData(selectedSchoolId, selectedSurveyId);
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
      await loadData(nextSelectedId, selectedSurveyId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const getInviteText = (invite) => {
    if (!invite) return "";
    const isLocalhost = typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (isLocalhost && invite.token) {
      return `${window.location.origin}/hs-coach-survey/${invite.token}`;
    }
    return invite.link || (invite.token ? `${window.location.origin}/hs-coach-survey/${invite.token}` : "");
  };

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
      await loadData(selectedSchoolId, selectedSurveyId);
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
      await loadData(selectedSchoolId, selectedSurveyId);
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
      await loadData(selectedSchoolId, selectedSurveyId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={classes.page}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Survey admin">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, ...classes.drawer }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, ...classes.drawer }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box sx={classes.content}>
        <Container maxWidth="lg" sx={{ display: "grid", gap: "20px" }}>
          <Paper sx={classes.card}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              {token && (
                <IconButton
                  onClick={handleDrawerToggle}
                  sx={{ display: { xs: "inline-flex", md: "none" }, color: "var(--color-text)" }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Avatar
                src={DauntlessAthleticsLogoDesktopCircleImg}
                alt="Dauntless Athletics Logo"
                sx={{ width: 56, height: 56 }}
              />
              <Box>
                <Typography
                  sx={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--color-text)" }}
                >
                  Survey Admin
                </Typography>
                <Typography sx={{ color: "var(--color-muted)" }}>
                  {token ? `${activeLabel} Dashboard` : "Sign in to continue"}
                </Typography>
              </Box>
            </Box>
          </Box>
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
              {dataError && <Alert severity="error">{dataError}</Alert>}
              {activeSection === "surveys" && (
                <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Surveys</Typography>
                <Typography sx={{ color: "var(--color-muted)" }}>
                  Build survey templates and select which one to use for invite links.
                </Typography>
                <Box sx={{ display: "grid", gap: "12px" }}>
                  <TextField
                    label="Survey title"
                    value={newSurveyTitle}
                    onChange={(event) => setNewSurveyTitle(event.target.value)}
                    sx={classes.input}
                  />
                  <TextField
                    label="Description (optional)"
                    value={newSurveyDescription}
                    onChange={(event) => setNewSurveyDescription(event.target.value)}
                    sx={classes.input}
                    multiline
                    minRows={2}
                  />
                  <TextField
                    label="Comment prompt (optional)"
                    value={newSurveyCommentPrompt}
                    onChange={(event) => setNewSurveyCommentPrompt(event.target.value)}
                    sx={classes.input}
                    multiline
                    minRows={2}
                  />
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Questions</Typography>
                  {newSurveyQuestions.map((question, index) => (
                    <Box key={`survey-question-${index}`} sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <TextField
                        label={`Question ${index + 1}`}
                        value={question.text}
                        onChange={(event) => handleUpdateSurveyQuestion(index, event.target.value)}
                        sx={{ ...classes.input, flex: 1, minWidth: "240px" }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: "var(--color-text)" }}
                        disabled={newSurveyQuestions.length <= 1}
                        onClick={() => handleRemoveSurveyQuestion(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleAddSurveyQuestion}>
                      Add Question
                    </Button>
                    <Button variant="contained" sx={classes.button} onClick={handleCreateSurvey}>
                      Create Survey
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: "var(--color-border)" }} />

                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Survey List</Typography>
                {surveys.length > 0 && (
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "var(--color-surface-3)", borderRadius: "14px" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Survey</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Questions</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Status</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }} align="right">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {surveys.map((survey) => (
                          <TableRow key={survey.id} hover>
                            <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                              {survey.title}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {survey.questions?.length || 0}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {survey.isActive ? "Active" : "Inactive"}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ color: "var(--color-text)" }}
                                  onClick={() => handleStartEditSurvey(survey)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ color: "var(--color-text)" }}
                                  onClick={() => handleToggleSurveyActive(survey)}
                                >
                                  {survey.isActive ? "Deactivate" : "Activate"}
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{ color: "var(--color-text)" }}
                                  onClick={() => handleDeleteSurvey(survey.id)}
                                >
                                  Delete
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                {surveys.length === 0 && (
                  <Typography sx={{ color: "var(--color-muted)" }}>
                    No surveys yet. Create one above to get started.
                  </Typography>
                )}

                <Divider sx={{ borderColor: "var(--color-border)" }} />

                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Edit Survey</Typography>
                {!editingSurveyId ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>
                    Select a survey and click Edit to update its details.
                  </Typography>
                ) : (
                  <Box sx={{ display: "grid", gap: "12px" }}>
                    <TextField
                      label="Survey title"
                      value={editSurveyTitle}
                      onChange={(event) => setEditSurveyTitle(event.target.value)}
                      sx={classes.input}
                    />
                    <TextField
                      label="Description (optional)"
                      value={editSurveyDescription}
                      onChange={(event) => setEditSurveyDescription(event.target.value)}
                      sx={classes.input}
                      multiline
                      minRows={2}
                    />
                    <TextField
                      label="Comment prompt (optional)"
                      value={editSurveyCommentPrompt}
                      onChange={(event) => setEditSurveyCommentPrompt(event.target.value)}
                      sx={classes.input}
                      multiline
                      minRows={2}
                    />
                    <TextField
                      select
                      label="Status"
                      value={editSurveyActive ? "active" : "inactive"}
                      onChange={(event) => setEditSurveyActive(event.target.value === "active")}
                      sx={classes.input}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </TextField>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Questions</Typography>
                    {editSurveyQuestions.map((question, index) => (
                      <Box
                        key={`edit-question-${index}`}
                        sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                      >
                        <TextField
                          label={`Question ${index + 1}`}
                          value={question.text}
                          onChange={(event) => handleUpdateEditSurveyQuestion(index, event.target.value)}
                          sx={{ ...classes.input, flex: 1, minWidth: "240px" }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ color: "var(--color-text)" }}
                          disabled={editSurveyQuestions.length <= 1}
                          onClick={() => handleRemoveEditSurveyQuestion(index)}
                        >
                          Remove
                        </Button>
                      </Box>
                    ))}
                    <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                      Editing questions will replace the survey questions. If responses exist, questions cannot be updated.
                    </Typography>
                    <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        sx={{ color: "var(--color-text)" }}
                        onClick={handleAddEditSurveyQuestion}
                      >
                        Add Question
                      </Button>
                      <Button variant="contained" sx={classes.button} onClick={handleSaveSurveyEdits}>
                        Save Changes
                      </Button>
                      <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleCancelEditSurvey}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
              )}
              {activeSection === "schools" && (
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
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "var(--color-surface-3)", borderRadius: "14px" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "var(--color-muted)" }}>School</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Created</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }} align="right">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {schools.map((school) => {
                          const isEditing = editingSchoolId === school.id;
                          return (
                            <TableRow key={school.id} hover>
                              <TableCell sx={{ color: "var(--color-text)" }}>
                                {isEditing ? (
                                  <TextField
                                    label="School name"
                                    value={editingSchoolName}
                                    onChange={(event) => setEditingSchoolName(event.target.value)}
                                    sx={{ ...classes.input, minWidth: "200px" }}
                                  />
                                ) : (
                                  <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                                    {school.name}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell sx={{ color: "var(--color-text)" }}>
                                {formatDate(school.created_at)}
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
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
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
              )}

              {activeSection === "invites" && (
                <>
                  <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Links</Typography>
                <Typography sx={{ color: "var(--color-muted)" }}>
                  Generate unique links per coach. Copy them now — they won’t be shown again.
                </Typography>
                <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <TextField
                    select
                    label="Survey"
                    value={selectedSurveyId}
                    onChange={(event) => setSelectedSurveyId(event.target.value)}
                    sx={{ ...classes.input, minWidth: "220px" }}
                  >
                    {inviteSurveyOptions.map((survey) => (
                      <MenuItem key={survey.id} value={survey.id}>
                        {survey.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="School"
                    value={selectedSchoolId}
                    onChange={(event) => setSelectedSchoolId(event.target.value)}
                    sx={{ ...classes.input, minWidth: "220px" }}
                  >
                    {inviteSchoolOptions.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <TextField
                    label="Count"
                    type="number"
                    value={inviteCount}
                    onChange={(event) => setInviteCount(event.target.value)}
                    sx={{ ...classes.input, maxWidth: "120px" }}
                    inputProps={{ min: 1, max: 50 }}
                  />
                  <Button
                    variant="contained"
                    sx={classes.button}
                    onClick={handleCreateInvites}
                    disabled={!selectedSchoolId || !selectedSurveyId}
                  >
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
                    <TableContainer
                      component={Paper}
                      sx={{ backgroundColor: "var(--color-surface-3)", borderRadius: "14px" }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: "var(--color-muted)" }} />
                            <TableCell sx={{ color: "var(--color-muted)" }}>Invite Link</TableCell>
                            <TableCell sx={{ color: "var(--color-muted)" }} align="right">
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {latestInvites.map((invite) => {
                            const inviteText = getInviteText(invite);
                            return (
                              <TableRow key={invite.id} hover>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedInviteIds.includes(invite.id)}
                                    onChange={() => toggleInviteSelection(invite.id)}
                                    sx={{
                                      color: "var(--color-muted)",
                                      "&.Mui-checked": { color: "var(--color-accent)" },
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ color: "var(--color-text)", fontFamily: "monospace" }}>
                                  {inviteText}
                                </TableCell>
                                <TableCell align="right">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ color: "var(--color-text)" }}
                                    onClick={() => copyToClipboard(inviteText)}
                                  >
                                    Copy
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                  </Box>

                  <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Status</Typography>
                {invites.length === 0 ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>No invite links yet.</Typography>
                ) : (
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "var(--color-surface-3)", borderRadius: "14px" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "var(--color-muted)" }}>School</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Survey</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Status</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }} align="right">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invites.map((invite) => (
                          <TableRow key={invite.id} hover>
                            <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                              {invite.school_name}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {invite.survey_title || "—"}
                            </TableCell>
                            <TableCell sx={{ color: invite.used_at ? "var(--color-accent)" : "var(--color-muted)" }}>
                              {invite.used_at ? `Used ${formatDate(invite.used_at)}` : "Unused"}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                {!invite.used_at && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ color: "var(--color-text)" }}
                                    onClick={() => handleRegenerateInvite(invite.id)}
                                  >
                                    Resend
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
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                  </Box>
                </>
              )}

              {activeSection === "responses" && (
                <Box sx={classes.section}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Responses</Typography>
                <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <TextField
                    select
                    label="Survey"
                    value={selectedSurveyId}
                    onChange={(event) => setSelectedSurveyId(event.target.value)}
                    sx={{ ...classes.input, minWidth: "220px" }}
                  >
                    {inviteSurveyOptions.map((survey) => (
                      <MenuItem key={survey.id} value={survey.id}>
                        {survey.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="School"
                    value={selectedSchoolId}
                    onChange={(event) => setSelectedSchoolId(event.target.value)}
                    sx={{ ...classes.input, minWidth: "220px" }}
                  >
                    {inviteSchoolOptions.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                {!selectedSurveyId ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>
                    Select a survey above to view question-by-question responses.
                  </Typography>
                ) : responses.length === 0 ? (
                  <Typography sx={{ color: "var(--color-muted)" }}>No responses yet.</Typography>
                ) : (
                  <TableContainer
                    component={Paper}
                    sx={{ backgroundColor: "var(--color-surface-3)", borderRadius: "14px" }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: "var(--color-muted)" }}>School</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Survey</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Date</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }}>Comment</TableCell>
                          <TableCell sx={{ color: "var(--color-muted)" }} align="right">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {responses.map((response) => (
                          <TableRow key={response.id} hover>
                            <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                              {response.school_name}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {response.survey_title || "—"}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {formatDate(response.created_at)}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {response.comment
                                ? response.comment.length > 60
                                  ? `${response.comment.slice(0, 60)}...`
                                  : response.comment
                                : "—"}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ color: "var(--color-text)" }}
                                onClick={() => setResponseDetail(response)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
              )}
            </>
          )}
          </Paper>
        </Container>
        <Dialog
          open={Boolean(responseDetail)}
          onClose={() => setResponseDetail(null)}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
        >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Response Details
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px", color: "var(--color-muted)" }}>
          {responseDetail && (
            <>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {responseDetail.school_name}
              </Typography>
              {responseDetail.survey_title && (
                <Typography sx={{ color: "var(--color-muted)" }}>{responseDetail.survey_title}</Typography>
              )}
              <Typography sx={{ color: "var(--color-muted)" }}>
                {formatDate(responseDetail.created_at)}
              </Typography>
              <Divider sx={{ borderColor: "var(--color-border)" }} />
              {(selectedSurvey?.questions || []).map((question) => (
                <Box key={question.id} sx={{ display: "grid", gap: "4px" }}>
                  <Typography sx={{ color: "var(--color-text)" }}>{question.text}</Typography>
                  <Typography sx={{ color: "var(--color-accent)" }}>
                    {ratingLabelMap[responseDetail?.answers?.[question.id]] ||
                      responseDetail?.answers?.[question.id] ||
                      "n/a"}
                  </Typography>
                </Box>
              ))}
              {responseDetail.comment && (
                <Box>
                  <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>Comments</Typography>
                  <Typography sx={{ color: "var(--color-muted)" }}>{responseDetail.comment}</Typography>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setResponseDetail(null)}>
            Close
          </Button>
        </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
