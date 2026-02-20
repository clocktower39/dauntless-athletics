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
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
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
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { apiRequest, authHeader } from "./surveyApi";
import { ratingOptions } from "./surveyConfig";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

const TOKEN_KEY = "dauntlessSurveyAdminToken";
const drawerWidth = 260;

const dayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

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

const emptyPractice = {
  teamId: "",
  contactId: "",
  dayOfWeek: 1,
  startTime: "15:00",
  endTime: "17:00",
  location: "",
  notes: "",
};

const audienceOptions = ["Coach", "Athlete", "Parent", "Staff", "Other"];

const classes = {
  page: {
    minHeight: "100vh",
    padding: 0,
    display: "flex",
    background:
      "radial-gradient(circle at 15% 15%, rgba(215, 38, 56, 0.18), transparent 45%), linear-gradient(160deg, #0b1017 0%, #0d121a 40%, #0a0f16 100%)",
    "--color-text": "#f7f9fc",
    "--color-muted": "#a9b4c3",
    "--color-border": "rgba(255, 255, 255, 0.08)",
    "--color-surface": "#121822",
    "--color-surface-2": "#151c27",
    "--color-surface-3": "#1b2430",
    "--color-accent": "#d72638",
    "--color-accent-2": "#c21f31",
    "--shadow-soft": "0 18px 30px rgba(0,0,0,0.28)",
    "--shadow-strong": "0 28px 50px rgba(0,0,0,0.4)",
  },
  content: {
    flex: 1,
    padding: { xs: "18px 12px", md: "28px 24px" },
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      backgroundColor: "rgba(12, 17, 24, 0.98)",
      color: "var(--color-text)",
      borderRight: "1px solid var(--color-border)",
      padding: "18px 16px",
      boxSizing: "border-box",
    },
  },
  shell: {
    display: "grid",
    gap: "16px",
  },
  headerCard: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: { xs: "16px", md: "20px 22px" },
    boxShadow: "var(--shadow-strong)",
    display: "grid",
    gap: "16px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: "\"\"",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, rgba(215,38,56,0.9), rgba(215,38,56,0.2), rgba(215,38,56,0))",
    },
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  headerMeta: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
  },
  headerMetaItem: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "10px 12px",
    display: "grid",
    gap: "4px",
  },
  kpiRow: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(6, minmax(0, 1fr))" },
  },
  kpiCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "10px 12px",
    display: "grid",
    gap: "4px",
  },
  kpiLabel: {
    color: "var(--color-muted)",
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  kpiValue: {
    color: "var(--color-text)",
    fontSize: "1.2rem",
    fontWeight: 700,
  },
  panel: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "16px",
    padding: "16px 18px",
    boxShadow: "var(--shadow-soft)",
    display: "grid",
    gap: "8px",
  },
  section: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "16px",
    padding: "16px 18px",
    boxShadow: "var(--shadow-soft)",
    display: "grid",
    gap: "12px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: "\"\"",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: "linear-gradient(90deg, rgba(215,38,56,0.9), rgba(215,38,56,0))",
    },
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  panelTitle: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "var(--color-text)",
  },
  panelSubtitle: {
    color: "var(--color-muted)",
    fontSize: "0.82rem",
  },
  panelBody: {
    display: "grid",
    gap: "12px",
  },
  statCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "12px 14px",
    display: "grid",
    gap: "6px",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface-3)",
      color: "var(--color-text)",
      borderRadius: "10px",
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
      fontSize: "0.82rem",
    },
    "& .MuiInputBase-input": {
      padding: "10px 12px",
      fontSize: "0.9rem",
    },
    "& .MuiSelect-select": {
      padding: "10px 12px",
      fontSize: "0.9rem",
    },
  },
  button: {
    backgroundColor: "var(--color-accent)",
    borderRadius: "10px",
    padding: "8px 16px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.85rem",
    "&:hover": {
      backgroundColor: "var(--color-accent-2)",
    },
  },
  tablePaper: {
    backgroundColor: "var(--color-surface-2)",
    borderRadius: "12px",
    border: "1px solid var(--color-border)",
  },
  tableHeadCell: {
    color: "var(--color-muted)",
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
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
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
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
  const [teamForm, setTeamForm] = useState(emptyTeam);
  const [contactForm, setContactForm] = useState(emptyContact);
  const [practiceForm, setPracticeForm] = useState(emptyPractice);
  const [practices, setPractices] = useState([]);
  const [editingSchoolId, setEditingSchoolId] = useState(null);
  const [editingSchoolName, setEditingSchoolName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingPracticeId, setEditingPracticeId] = useState(null);
  const [inviteCount, setInviteCount] = useState(1);
  const [latestInvites, setLatestInvites] = useState([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState([]);
  const [dataError, setDataError] = useState("");
  const [responseDetail, setResponseDetail] = useState(null);
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [surveyCreateOpen, setSurveyCreateOpen] = useState(false);
  const [surveyEditOpen, setSurveyEditOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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

  const selectedSchool = useMemo(
    () => schools.find((school) => String(school.id) === String(selectedSchoolId)) || null,
    [schools, selectedSchoolId]
  );

  const selectedTeam = useMemo(
    () => teams.find((team) => String(team.id) === String(selectedTeamId)) || null,
    [teams, selectedTeamId]
  );

  const totalContacts = useMemo(
    () => teams.reduce((sum, team) => sum + (team.contact_count || 0), 0),
    [teams]
  );

  const activeSection = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return "overview";
    return parts[1] || "overview";
  }, [location.pathname]);

  const basePath = "/dashboard";

  const navItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: <DashboardOutlinedIcon /> },
      { id: "clients", label: "Clients", icon: <BusinessIcon /> },
      { id: "contacts", label: "Contacts", icon: <ContactsIcon /> },
      { id: "schedules", label: "Schedules", icon: <EventNoteIcon /> },
      { id: "surveys", label: "Surveys", icon: <AssignmentOutlinedIcon /> },
    ],
    []
  );

  const activeLabel = useMemo(() => {
    const match = navItems.find((item) => item.id === activeSection);
    return match ? match.label : "Overview";
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
            Client Management
          </Typography>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Dauntless Athletics
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "var(--color-border)" }} />
      {token ? (
        <List dense sx={{ display: "grid", gap: "6px" }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.id}
              component={Link}
              to={`${basePath}/${item.id}`}
              onClick={() => setMobileOpen(false)}
              selected={activeSection === item.id}
              sx={{
                borderRadius: "12px",
                color: "var(--color-text)",
                paddingY: "10px",
                "&.Mui-selected": {
                  backgroundColor: "rgba(215, 38, 56, 0.18)",
                  border: "1px solid rgba(215, 38, 56, 0.35)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(215, 38, 56, 0.22)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "inherit",
                  opacity: activeSection === item.id ? 1 : 0.7,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 500 }}
              />
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
              variant="outlined"
              size="small"
              onClick={handleLogout}
              sx={{ color: "var(--color-text)", borderColor: "var(--color-border)", textTransform: "none" }}
            >
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

  const loadPractices = useCallback(
    async (teamId) => {
      if (!teamId) {
        setPractices([]);
        return;
      }
      const result = await apiRequest(`/api/admin/practices?team_id=${teamId}`, {
        headers: authHeaders,
      });
      setPractices(result.practices || []);
    },
    [authHeaders]
  );

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
    if (!selectedTeamId && teams.length > 0) {
      setSelectedTeamId(String(teams[0].id));
    }
  }, [selectedTeamId, teams]);

  useEffect(() => {
    if (!token) return;
    const fetchAll = async () => {
      try {
        setDataError("");
        await loadSchools();
        await loadTeams();
        await loadSurveys();
        await loadData(selectedSchoolId, selectedSurveyId);
      } catch (error) {
        setDataError(error.message);
      }
    };
    fetchAll();
  }, [token, selectedSchoolId, selectedSurveyId, loadSchools, loadSurveys, loadTeams, loadData]);

  useEffect(() => {
    if (!token) return;
    loadContacts(selectedTeamId);
    loadPractices(selectedTeamId);
  }, [token, selectedTeamId, loadContacts, loadPractices]);

  useEffect(() => {
    if (!editingContactId) {
      setContactForm((prev) => ({ ...prev, teamId: selectedTeamId || "" }));
    }
  }, [selectedTeamId, editingContactId]);

  useEffect(() => {
    if (!editingPracticeId) {
      setPracticeForm((prev) => ({ ...prev, teamId: selectedTeamId || "" }));
    }
  }, [selectedTeamId, editingPracticeId]);

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
      setSchoolModalOpen(false);
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
      setSurveyCreateOpen(false);
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
    setSurveyEditOpen(true);
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
    setSurveyEditOpen(false);
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
      setSurveyEditOpen(false);
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
      setInviteModalOpen(false);
      await loadData(selectedSchoolId, selectedSurveyId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditSchool = (school) => {
    setEditingSchoolId(school.id);
    setEditingSchoolName(school.name);
    setSchoolModalOpen(true);
  };

  const handleCancelEditSchool = () => {
    setEditingSchoolId(null);
    setEditingSchoolName("");
    setSchoolModalOpen(false);
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
      setSchoolModalOpen(false);
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
      setTeamModalOpen(false);
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
      setContactModalOpen(false);
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
    setContactModalOpen(true);
  };

  const handleCancelContactEdit = () => {
    setEditingContactId(null);
    setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId }));
    setContactModalOpen(false);
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

  const handleSavePractice = async () => {
    if (!practiceForm.teamId) {
      setDataError("Select a team for this practice.");
      return;
    }
    if (!practiceForm.startTime || !practiceForm.endTime) {
      setDataError("Start and end times are required.");
      return;
    }

    try {
      setDataError("");
      if (editingPracticeId) {
        await apiRequest(`/api/admin/practices/${editingPracticeId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            team_id: Number(practiceForm.teamId),
            contact_id: practiceForm.contactId ? Number(practiceForm.contactId) : null,
            day_of_week: Number(practiceForm.dayOfWeek),
            start_time: practiceForm.startTime,
            end_time: practiceForm.endTime,
            location: practiceForm.location.trim(),
            notes: practiceForm.notes.trim(),
          }),
        });
      } else {
        await apiRequest("/api/admin/practices", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            team_id: Number(practiceForm.teamId),
            contact_id: practiceForm.contactId ? Number(practiceForm.contactId) : null,
            day_of_week: Number(practiceForm.dayOfWeek),
            start_time: practiceForm.startTime,
            end_time: practiceForm.endTime,
            location: practiceForm.location.trim(),
            notes: practiceForm.notes.trim(),
          }),
        });
      }
      setPracticeForm((prev) => ({ ...emptyPractice, teamId: prev.teamId }));
      setEditingPracticeId(null);
      setPracticeModalOpen(false);
      await loadPractices(practiceForm.teamId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditPractice = (practice) => {
    setEditingPracticeId(practice.id);
    setPracticeForm({
      teamId: String(practice.team_id),
      contactId: practice.contact_id ? String(practice.contact_id) : "",
      dayOfWeek: Number(practice.day_of_week),
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
      await loadPractices(selectedTeamId);
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

  const kpiStats = [
    { label: "Clients", value: schools.length },
    { label: "Teams", value: teams.length },
    { label: "Contacts", value: totalContacts },
    { label: "Practices", value: practices.length },
    { label: "Surveys", value: surveys.length },
    { label: "Responses", value: responses.length },
  ];

  const headerMetaItems = [
    { label: "Active Survey", value: selectedSurvey?.title || "—" },
    { label: "School Focus", value: selectedSchool?.name || "All schools" },
    { label: "Team Focus", value: selectedTeam?.name || "All teams" },
  ];


  return (
    <Box sx={classes.page}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Dashboard navigation">
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
        <Container maxWidth="xl" sx={classes.shell}>
          <Paper sx={classes.headerCard}>
          <Box sx={classes.headerTop}>
            <Box sx={classes.headerTitle}>
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
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography
                  sx={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-text)" }}
                >
                  Client Management
                </Typography>
                <Typography sx={{ color: "var(--color-muted)" }}>
                  {token ? `${activeLabel} Dashboard` : "Sign in to continue"}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
            Internal workspace for managing client relationships, team schedules, and survey operations.
          </Typography>
          {token && (
            <>
              <Divider sx={{ borderColor: "var(--color-border)" }} />
              <Box sx={classes.headerMeta}>
                {headerMetaItems.map((item) => (
                  <Box key={item.label} sx={classes.headerMetaItem}>
                    <Typography sx={{ color: "var(--color-muted)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={classes.kpiRow}>
                {kpiStats.map((stat) => (
                  <Box key={stat.label} sx={classes.kpiCard}>
                    <Typography sx={classes.kpiLabel}>{stat.label}</Typography>
                    <Typography sx={classes.kpiValue}>{stat.value}</Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
          </Paper>

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
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Surveys</Typography>
                    <Typography sx={{ color: "var(--color-muted)" }}>
                      Manage survey templates and activation status.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={classes.button}
                    onClick={() => {
                      setNewSurveyTitle("");
                      setNewSurveyDescription("");
                      setNewSurveyCommentPrompt("");
                      setNewSurveyQuestions([{ text: "" }]);
                      setSurveyCreateOpen(true);
                    }}
                  >
                    Create Survey
                  </Button>
                </Box>
                <Divider sx={{ borderColor: "var(--color-border)" }} />

                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Survey Library</Typography>
                {surveys.length > 0 ? (
                  <TableContainer component={Paper} sx={classes.tablePaper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Questions</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                          <TableCell sx={classes.tableHeadCell} align="right">
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
                ) : (
                  <Typography sx={{ color: "var(--color-muted)" }}>
                    No surveys yet. Create one to get started.
                  </Typography>
                )}
              </Box>
              )}

              {activeSection === "overview" && (
                <Box sx={classes.section}>
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Business Snapshot</Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gap: "12px",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                    }}
                  >
                    {[
                      { label: "Clients", value: schools.length },
                      { label: "Teams", value: teams.length },
                      { label: "Contacts", value: totalContacts },
                      { label: "Practices", value: practices.length },
                      { label: "Surveys", value: surveys.length },
                      { label: "Responses", value: responses.length },
                    ].map((stat) => (
                      <Box key={stat.label} sx={classes.statCard}>
                        <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                          {stat.label}
                        </Typography>
                        <Typography sx={{ color: "var(--color-text)", fontSize: "1.4rem", fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ borderColor: "var(--color-border)" }} />
                  <Box
                    sx={{
                      display: "grid",
                      gap: "16px",
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                    }}
                  >
                    <Box sx={{ display: "grid", gap: "10px" }}>
                      <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                        Recent Invites
                      </Typography>
                      {invites.length === 0 ? (
                        <Typography sx={{ color: "var(--color-muted)" }}>
                          No invite activity yet.
                        </Typography>
                      ) : (
                        <TableContainer component={Paper} sx={classes.tablePaper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={classes.tableHeadCell}>School</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {invites.slice(0, 5).map((invite) => (
                                <TableRow key={invite.id} hover>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {invite.school_name}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {invite.survey_title || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: invite.used_at ? "var(--color-accent)" : "var(--color-muted)" }}>
                                    {invite.used_at ? "Used" : "Unused"}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                    <Box sx={{ display: "grid", gap: "10px" }}>
                      <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                        Recent Responses
                      </Typography>
                      {responses.length === 0 ? (
                        <Typography sx={{ color: "var(--color-muted)" }}>
                          No responses yet.
                        </Typography>
                      ) : (
                        <TableContainer component={Paper} sx={classes.tablePaper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={classes.tableHeadCell}>School</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Date</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {responses.slice(0, 5).map((response) => (
                                <TableRow key={response.id} hover>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {response.school_name}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {response.survey_title || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {formatDate(response.created_at)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              {activeSection === "clients" && (
                <>
                  <Box sx={classes.section}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Schools</Typography>
                  <Button
                    variant="contained"
                    sx={classes.button}
                    onClick={() => {
                      setNewSchoolName("");
                      setEditingSchoolId(null);
                      setEditingSchoolName("");
                      setSchoolModalOpen(true);
                    }}
                  >
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
                    sx={classes.tablePaper}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={classes.tableHeadCell}>School</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Created</TableCell>
                          <TableCell sx={classes.tableHeadCell} align="right">
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {schools.map((school) => (
                          <TableRow key={school.id} hover>
                            <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                              {school.name}
                            </TableCell>
                            <TableCell sx={{ color: "var(--color-text)" }}>
                              {formatDate(school.created_at)}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
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
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                  </Box>

                  <Box sx={classes.section}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Teams</Typography>
                      <Button
                        variant="contained"
                        sx={classes.button}
                        onClick={() => {
                          setEditingTeamId(null);
                          setTeamForm(emptyTeam);
                          setTeamModalOpen(true);
                        }}
                      >
                        Add Team
                      </Button>
                    </Box>

                    {teams.length > 0 && (
                      <TableContainer
                        component={Paper}
                        sx={classes.tablePaper}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                              <TableCell sx={classes.tableHeadCell}>School</TableCell>
                              <TableCell sx={classes.tableHeadCell}>Contacts</TableCell>
                              <TableCell sx={classes.tableHeadCell} align="right">
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {teams.map((team) => (
                              <TableRow key={team.id} hover>
                                <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                                  {team.name}
                                </TableCell>
                                <TableCell sx={{ color: "var(--color-text)" }}>
                                  {team.school_name || "—"}
                                </TableCell>
                                <TableCell sx={{ color: "var(--color-text)" }}>
                                  {team.contact_count || 0}
                                </TableCell>
                                <TableCell align="right">
                                  <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
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

              {activeSection === "contacts" && (
                <Box sx={classes.section}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Contacts</Typography>
                    <Button
                      variant="contained"
                      sx={classes.button}
                      onClick={() => {
                        setEditingContactId(null);
                        setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId || selectedTeamId || "" }));
                        setContactModalOpen(true);
                      }}
                      disabled={teams.length === 0}
                    >
                      Add Contact
                    </Button>
                  </Box>
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
                      {contacts.length === 0 ? (
                        <Typography sx={{ color: "var(--color-muted)" }}>No contacts yet.</Typography>
                      ) : (
                        <TableContainer
                          component={Paper}
                          sx={classes.tablePaper}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={classes.tableHeadCell}>Name</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Role</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Audience</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Email</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Phone</TableCell>
                                <TableCell sx={classes.tableHeadCell} align="right">
                                  Actions
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {contacts.map((contact) => (
                                <TableRow key={contact.id} hover>
                                  <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                                    {contact.name}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {contact.role || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {contact.audience || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {contact.email || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {contact.phone || "—"}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
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
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </>
                  )}
                </Box>
              )}

              {activeSection === "schedules" && (
                <Box sx={classes.section}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Practice Schedule</Typography>
                    <Button
                      variant="contained"
                      sx={classes.button}
                      onClick={() => {
                        setEditingPracticeId(null);
                        setPracticeForm((prev) => ({ ...emptyPractice, teamId: prev.teamId || selectedTeamId || "" }));
                        setPracticeModalOpen(true);
                      }}
                      disabled={teams.length === 0}
                    >
                      Add Practice
                    </Button>
                  </Box>
                  {teams.length === 0 ? (
                    <Typography sx={{ color: "var(--color-muted)" }}>
                      Add a team first to create a practice schedule.
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
                      {practices.length === 0 ? (
                        <Typography sx={{ color: "var(--color-muted)" }}>No practices scheduled yet.</Typography>
                      ) : (
                        <TableContainer
                          component={Paper}
                          sx={classes.tablePaper}
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={classes.tableHeadCell}>Day</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Time</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Coach</TableCell>
                                <TableCell sx={classes.tableHeadCell}>Location</TableCell>
                                <TableCell sx={classes.tableHeadCell} align="right">
                                  Actions
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {practices.map((practice) => (
                                <TableRow key={practice.id} hover>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {dayOptions.find((day) => day.value === practice.day_of_week)?.label || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {practice.start_time?.slice(0, 5)} - {practice.end_time?.slice(0, 5)}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {practice.contact_name || "—"}
                                  </TableCell>
                                  <TableCell sx={{ color: "var(--color-text)" }}>
                                    {practice.location || "—"}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ color: "var(--color-text)" }}
                                        onClick={() => handleEditPractice(practice)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ color: "var(--color-text)" }}
                                        onClick={() => handleDeletePractice(practice.id)}
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
                    </>
                  )}
                </Box>
              )}

              {activeSection === "surveys" && (
                <>
                  <Box sx={classes.section}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Links</Typography>
                    <Typography sx={{ color: "var(--color-muted)" }}>
                      Generate unique links per coach. Copy them now — they won’t be shown again.
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={classes.button}
                    onClick={() => setInviteModalOpen(true)}
                    disabled={schools.length === 0 || surveys.length === 0}
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
                      sx={classes.tablePaper}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={classes.tableHeadCell} />
                            <TableCell sx={classes.tableHeadCell}>Invite Link</TableCell>
                            <TableCell sx={classes.tableHeadCell} align="right">
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
                    sx={classes.tablePaper}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={classes.tableHeadCell}>School</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                          <TableCell sx={classes.tableHeadCell} align="right">
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

              {activeSection === "surveys" && (
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
                    sx={classes.tablePaper}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={classes.tableHeadCell}>School</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Date</TableCell>
                          <TableCell sx={classes.tableHeadCell}>Comment</TableCell>
                          <TableCell sx={classes.tableHeadCell} align="right">
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
        </Container>
        <Dialog
          open={schoolModalOpen}
          onClose={() => {
            if (editingSchoolId) {
              handleCancelEditSchool();
            } else {
              setSchoolModalOpen(false);
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
        >
          <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            {editingSchoolId ? "Edit School" : "Add School"}
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: "12px" }}>
            <TextField
              label="School name"
              value={editingSchoolId ? editingSchoolName : newSchoolName}
              onChange={(event) =>
                editingSchoolId
                  ? setEditingSchoolName(event.target.value)
                  : setNewSchoolName(event.target.value)
              }
              sx={classes.input}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              sx={{ color: "var(--color-text)" }}
              onClick={() => {
                if (editingSchoolId) {
                  handleCancelEditSchool();
                } else {
                  setSchoolModalOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={classes.button}
              onClick={() => {
                if (editingSchoolId) {
                  handleSaveSchool(editingSchoolId);
                } else {
                  handleCreateSchool();
                }
              }}
            >
              {editingSchoolId ? "Save School" : "Add School"}
            </Button>
          </DialogActions>
        </Dialog>

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
          open={contactModalOpen}
          onClose={() => {
            if (editingContactId) {
              handleCancelContactEdit();
            } else {
              setContactModalOpen(false);
            }
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
                sx={{ ...classes.input, flex: 1, minWidth: "200px" }}
              />
              <TextField
                label="Phone"
                value={contactForm.phone}
                onChange={(event) => setContactForm((prev) => ({ ...prev, phone: event.target.value }))}
                sx={{ ...classes.input, flex: 1, minWidth: "160px" }}
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
                  handleCancelContactEdit();
                } else {
                  setContactModalOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" sx={classes.button} onClick={handleSaveContact}>
              {editingContactId ? "Save Contact" : "Add Contact"}
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

        <Dialog
          open={surveyCreateOpen}
          onClose={() => setSurveyCreateOpen(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
        >
          <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Create Survey
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: "12px" }}>
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
            <Divider sx={{ borderColor: "var(--color-border)" }} />
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
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setSurveyCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleAddSurveyQuestion}>
              Add Question
            </Button>
            <Button variant="contained" sx={classes.button} onClick={handleCreateSurvey}>
              Create Survey
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={surveyEditOpen}
          onClose={handleCancelEditSurvey}
          fullWidth
          maxWidth="md"
          PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
        >
          <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Edit Survey
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: "12px" }}>
            {!editingSurveyId ? (
              <Typography sx={{ color: "var(--color-muted)" }}>
                Select a survey from the table to edit it.
              </Typography>
            ) : (
              <>
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
                <Divider sx={{ borderColor: "var(--color-border)" }} />
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Questions</Typography>
                {editSurveyQuestions.map((question, index) => (
                  <Box key={`edit-question-${index}`} sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleCancelEditSurvey}>
              Cancel
            </Button>
            {editingSurveyId && (
              <>
                <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleAddEditSurveyQuestion}>
                  Add Question
                </Button>
                <Button variant="contained" sx={classes.button} onClick={handleSaveSurveyEdits}>
                  Save Changes
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        <Dialog
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
        >
          <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Generate Invite Links
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: "12px" }}>
            <TextField
              select
              label="Survey"
              value={selectedSurveyId}
              onChange={(event) => setSelectedSurveyId(event.target.value)}
              sx={classes.input}
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
              sx={classes.input}
            >
              {inviteSchoolOptions.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Count"
              type="number"
              value={inviteCount}
              onChange={(event) => setInviteCount(event.target.value)}
              sx={{ ...classes.input, maxWidth: "160px" }}
              inputProps={{ min: 1, max: 50 }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={classes.button}
              onClick={handleCreateInvites}
              disabled={!selectedSchoolId || !selectedSurveyId}
            >
              Generate Links
            </Button>
          </DialogActions>
        </Dialog>

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
