import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  Alert,
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
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DashboardHeader from "../../Components/Dashboard/DashboardHeader";
import DashboardNav from "../../Components/Dashboard/DashboardNav";
import OverviewSection from "../../Components/Dashboard/OverviewSection";
import OrganizationsSection from "../../Components/Dashboard/OrganizationsSection";
import TeamsSection from "../../Components/Dashboard/TeamsSection";
import PeopleSection from "../../Components/Dashboard/PeopleSection";
import SurveysSection from "../../Components/Dashboard/SurveysSection";
import CampaignsSection from "../../Components/Dashboard/CampaignsSection";
import ResponsesSection from "../../Components/Dashboard/ResponsesSection";
import OrganizationDrawer from "../../Components/Dashboard/OrganizationDrawer";
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
  organizationId: "",
  seasonId: "",
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
const organizationTypeOptions = [
  { value: "district", label: "District" },
  { value: "school", label: "School" },
  { value: "club", label: "All-Star Club" },
  { value: "company", label: "Company" },
  { value: "independent", label: "Independent" },
  { value: "other", label: "Other" },
];

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
  workspaceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  breadcrumb: {
    color: "var(--color-muted)",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  filterBar: {
    display: "grid",
    gap: "12px",
    padding: "12px",
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
  },
  bulkBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 12px",
    backgroundColor: "rgba(215, 38, 56, 0.12)",
    border: "1px solid rgba(215, 38, 56, 0.3)",
    borderRadius: "10px",
  },
  drawerPaper: {
    width: { xs: "100%", sm: 420 },
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
    borderLeft: "1px solid var(--color-border)",
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

export default function AdminDashboard() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [districts, setDistricts] = useState([]);
  const [schools, setSchools] = useState([]);
  const [teams, setTeams] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [coachAssignments, setCoachAssignments] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [responses, setResponses] = useState([]);
  const [invites, setInvites] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newSchoolDistrictId, setNewSchoolDistrictId] = useState("");
  const [newSchoolType, setNewSchoolType] = useState("school");
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
  const [editingSchoolDistrictId, setEditingSchoolDistrictId] = useState("");
  const [editingSchoolType, setEditingSchoolType] = useState("school");
  const [editingDistrictId, setEditingDistrictId] = useState(null);
  const [editingDistrictName, setEditingDistrictName] = useState("");
  const [editingDistrictType, setEditingDistrictType] = useState("district");
  const [newDistrictName, setNewDistrictName] = useState("");
  const [newDistrictType, setNewDistrictType] = useState("district");
  const [editingSeasonId, setEditingSeasonId] = useState(null);
  const [editingSeasonName, setEditingSeasonName] = useState("");
  const [editingSeasonStart, setEditingSeasonStart] = useState("");
  const [editingSeasonEnd, setEditingSeasonEnd] = useState("");
  const [editingSeasonActive, setEditingSeasonActive] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [newSeasonStart, setNewSeasonStart] = useState("");
  const [newSeasonEnd, setNewSeasonEnd] = useState("");
  const [newSeasonActive, setNewSeasonActive] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingPracticeId, setEditingPracticeId] = useState(null);
  const [editingCoachId, setEditingCoachId] = useState(null);
  const [inviteCount, setInviteCount] = useState(1);
  const [latestInvites, setLatestInvites] = useState([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState([]);
  const [dataError, setDataError] = useState("");
  const [responseDetail, setResponseDetail] = useState(null);
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [districtModalOpen, setDistrictModalOpen] = useState(false);
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [coachModalOpen, setCoachModalOpen] = useState(false);
  const [assignCoachModalOpen, setAssignCoachModalOpen] = useState(false);
  const [surveyCreateOpen, setSurveyCreateOpen] = useState(false);
  const [surveyEditOpen, setSurveyEditOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [coachForm, setCoachForm] = useState({ name: "", email: "", phone: "" });
  const [assignCoachId, setAssignCoachId] = useState(null);
  const [assignTeamId, setAssignTeamId] = useState("");
  const [assignSeasonId, setAssignSeasonId] = useState("");
  const [assignCoachRole, setAssignCoachRole] = useState("");

  const [organizationSearch, setOrganizationSearch] = useState("");
  const [organizationTypeFilter, setOrganizationTypeFilter] = useState("all");
  const [organizationParentFilter, setOrganizationParentFilter] = useState("all");
  const [organizationStatusFilter, setOrganizationStatusFilter] = useState("all");
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);
  const [orgDrawerOpen, setOrgDrawerOpen] = useState(false);
  const [orgDrawerMode, setOrgDrawerMode] = useState("view");
  const [orgDraft, setOrgDraft] = useState({
    id: null,
    name: "",
    type: "school",
    parentId: "",
    status: "active",
  });

  const [teamSearch, setTeamSearch] = useState("");
  const [teamOrgFilter, setTeamOrgFilter] = useState("all");
  const [teamSeasonFilter, setTeamSeasonFilter] = useState("all");

  const [peopleView, setPeopleView] = useState("coaches");
  const [peopleSearch, setPeopleSearch] = useState("");

  const [surveySearch, setSurveySearch] = useState("");

  const districtOptions = useMemo(() => {
    return [{ id: "", name: "Select parent organization" }, ...districts];
  }, [districts]);

  const inviteSchoolOptions = useMemo(() => {
    return [{ id: "", name: "Select organization" }, ...schools];
  }, [schools]);

  const inviteSurveyOptions = useMemo(() => {
    return [{ id: "", title: "Select survey" }, ...surveys];
  }, [surveys]);

  const districtMap = useMemo(
    () => new Map(districts.map((district) => [String(district.id), district.name])),
    [districts]
  );

  const organizationTypeMap = useMemo(
    () => new Map(organizationTypeOptions.map((option) => [option.value, option.label])),
    []
  );

  const seasonMap = useMemo(
    () => new Map(seasons.map((season) => [String(season.id), season.name])),
    [seasons]
  );

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

  const activeSeason = useMemo(
    () => seasons.find((season) => season.is_active) || null,
    [seasons]
  );

  const totalContacts = useMemo(
    () => teams.reduce((sum, team) => sum + (team.contact_count || 0), 0),
    [teams]
  );

  const teamCountByOrg = useMemo(() => {
    return teams.reduce((acc, team) => {
      if (team.organization_id) {
        acc[team.organization_id] = (acc[team.organization_id] || 0) + 1;
      }
      return acc;
    }, {});
  }, [teams]);

  const filteredOrganizations = useMemo(() => {
    let items = [...schools];
    const term = organizationSearch.trim().toLowerCase();
    if (term) {
      items = items.filter((org) => org.name?.toLowerCase().includes(term));
    }
    if (organizationTypeFilter !== "all") {
      items = items.filter((org) => org.type === organizationTypeFilter);
    }
    if (organizationParentFilter === "none") {
      items = items.filter((org) => !org.parent_id);
    } else if (organizationParentFilter !== "all") {
      items = items.filter((org) => String(org.parent_id) === organizationParentFilter);
    }
    if (organizationStatusFilter !== "all") {
      items = items.filter((org) => org.status === organizationStatusFilter);
    }
    return items;
  }, [
    schools,
    organizationSearch,
    organizationTypeFilter,
    organizationParentFilter,
    organizationStatusFilter,
  ]);

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

  const filteredSurveys = useMemo(() => {
    const term = surveySearch.trim().toLowerCase();
    if (!term) return surveys;
    return surveys.filter((survey) => survey.title?.toLowerCase().includes(term));
  }, [surveys, surveySearch]);

  const allOrganizationsSelected =
    filteredOrganizations.length > 0 &&
    selectedOrganizationIds.length === filteredOrganizations.length;

  const activeSection = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return "overview";
    return parts[1] || "overview";
  }, [location.pathname]);

  const basePath = "/dashboard";

  const navItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: <DashboardOutlinedIcon /> },
      { id: "clients", label: "Organizations", icon: <BusinessIcon /> },
      { id: "teams", label: "Teams", icon: <EventNoteIcon /> },
      { id: "people", label: "People", icon: <ContactsIcon /> },
      { id: "surveys", label: "Surveys", icon: <AssignmentOutlinedIcon /> },
      { id: "campaigns", label: "Campaigns", icon: <AssignmentOutlinedIcon /> },
      { id: "responses", label: "Responses", icon: <AssignmentOutlinedIcon /> },
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
    <DashboardNav
      token={token}
      navItems={navItems}
      activeSection={activeSection}
      basePath={basePath}
      onNavigate={() => setMobileOpen(false)}
      onLogout={handleLogout}
      logoSrc={DauntlessAthleticsLogoDesktopCircleImg}
    />
  );

  const loadSeasons = useCallback(async () => {
    const result = await apiRequest("/api/admin/seasons", { headers: authHeaders });
    setSeasons(result.seasons || []);
  }, [authHeaders]);

  const loadOrganizations = useCallback(async () => {
    const result = await apiRequest("/api/admin/organizations", { headers: authHeaders });
    const organizations = result.organizations || [];
    setSchools(organizations);
    setDistricts(organizations.filter((org) => !org.parent_id));
  }, [authHeaders]);

  const loadTeams = useCallback(async () => {
    const result = await apiRequest("/api/admin/teams", { headers: authHeaders });
    setTeams(result.teams || []);
  }, [authHeaders]);

  const loadCoaches = useCallback(async () => {
    const result = await apiRequest("/api/admin/coaches", { headers: authHeaders });
    setCoaches(result.coaches || []);
  }, [authHeaders]);

  const loadCoachAssignments = useCallback(
    async (coachId) => {
      if (!coachId) {
        setCoachAssignments([]);
        return;
      }
      const result = await apiRequest(`/api/admin/coach-teams?coach_id=${coachId}`, {
        headers: authHeaders,
      });
      setCoachAssignments(result.assignments || []);
    },
    [authHeaders]
  );

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
    async (organizationId, surveyId) => {
      const params = [];
      if (organizationId) params.push(`organization_id=${organizationId}`);
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
        await loadOrganizations();
        await loadSeasons();
        await loadTeams();
        await loadCoaches();
        await loadSurveys();
        await loadData(selectedSchoolId, selectedSurveyId);
      } catch (error) {
        setDataError(error.message);
      }
    };
    fetchAll();
  }, [
    token,
    selectedSchoolId,
    selectedSurveyId,
    loadOrganizations,
    loadSeasons,
    loadTeams,
    loadCoaches,
    loadSurveys,
    loadData,
  ]);

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

  useEffect(() => {
    setSelectedOrganizationIds((prev) =>
      prev.filter((id) => filteredOrganizations.some((org) => org.id === id))
    );
  }, [filteredOrganizations]);

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

  const handleCreateDistrict = async () => {
    if (!newDistrictName.trim()) {
      setDataError("Enter an organization name to add.");
      return;
    }

    try {
      setDataError("");
      await apiRequest("/api/admin/organizations", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          name: newDistrictName.trim(),
          type: newDistrictType || "district",
        }),
      });
      setNewDistrictName("");
      setNewDistrictType("district");
      setDistrictModalOpen(false);
      await loadOrganizations();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditDistrict = (district) => {
    setEditingDistrictId(district.id);
    setEditingDistrictName(district.name);
    setEditingDistrictType(district.type || "district");
    setDistrictModalOpen(true);
  };

  const handleCancelEditDistrict = () => {
    setEditingDistrictId(null);
    setEditingDistrictName("");
    setEditingDistrictType("district");
    setDistrictModalOpen(false);
  };

  const handleSaveDistrict = async () => {
    if (!editingDistrictId) return;
    if (!editingDistrictName.trim()) {
      setDataError("Enter an organization name to save.");
      return;
    }

    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${editingDistrictId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: editingDistrictName.trim(),
          type: editingDistrictType || "district",
        }),
      });
      setEditingDistrictId(null);
      setEditingDistrictName("");
      setEditingDistrictType("district");
      setDistrictModalOpen(false);
      await loadOrganizations();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteDistrict = async (districtId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${districtId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await loadOrganizations();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleCreateSeason = async () => {
    if (!newSeasonName.trim()) {
      setDataError("Enter a season name to add.");
      return;
    }

    try {
      setDataError("");
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
      setNewSeasonName("");
      setNewSeasonStart("");
      setNewSeasonEnd("");
      setNewSeasonActive(false);
      setSeasonModalOpen(false);
      await loadSeasons();
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

  const handleSaveSeason = async () => {
    if (!editingSeasonId) return;
    if (!editingSeasonName.trim()) {
      setDataError("Enter a season name to save.");
      return;
    }

    try {
      setDataError("");
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
      setEditingSeasonId(null);
      setEditingSeasonName("");
      setEditingSeasonStart("");
      setEditingSeasonEnd("");
      setEditingSeasonActive(false);
      setSeasonModalOpen(false);
      await loadSeasons();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteSeason = async (seasonId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/seasons/${seasonId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await loadSeasons();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleCreateSchool = async () => {
    if (!newSchoolName.trim()) {
      setDataError("Enter a location name to add.");
      return;
    }

    try {
      setDataError("");
      await apiRequest("/api/admin/organizations", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          name: newSchoolName.trim(),
          type: newSchoolType || "school",
          parent_id: newSchoolDistrictId ? Number(newSchoolDistrictId) : null,
        }),
      });
      setNewSchoolName("");
      setNewSchoolDistrictId("");
      setNewSchoolType("school");
      setSchoolModalOpen(false);
      await loadOrganizations();
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
      setDataError("Select an organization before generating invite links.");
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
          organization_id: Number(selectedSchoolId),
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
    setEditingSchoolDistrictId(school.parent_id ? String(school.parent_id) : "");
    setEditingSchoolType(school.type || "school");
    setSchoolModalOpen(true);
  };

  const handleCancelEditSchool = () => {
    setEditingSchoolId(null);
    setEditingSchoolName("");
    setEditingSchoolDistrictId("");
    setEditingSchoolType("school");
    setSchoolModalOpen(false);
  };

  const handleSaveSchool = async (schoolId) => {
    if (!editingSchoolName.trim()) {
      setDataError("Enter a location name to save.");
      return;
    }

    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${schoolId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          name: editingSchoolName.trim(),
          type: editingSchoolType || "school",
          parent_id: editingSchoolDistrictId ? Number(editingSchoolDistrictId) : null,
        }),
      });
      setEditingSchoolId(null);
      setEditingSchoolName("");
      setEditingSchoolDistrictId("");
      setEditingSchoolType("school");
      setSchoolModalOpen(false);
      await loadOrganizations();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${schoolId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const nextSelectedId = String(schoolId) === String(selectedSchoolId) ? "" : selectedSchoolId;
      if (nextSelectedId !== selectedSchoolId) {
        setSelectedSchoolId(nextSelectedId);
      }
      await loadOrganizations();
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
            organization_id: teamForm.organizationId ? Number(teamForm.organizationId) : null,
            season_id: teamForm.seasonId ? Number(teamForm.seasonId) : null,
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
            organization_id: teamForm.organizationId ? Number(teamForm.organizationId) : null,
            season_id: teamForm.seasonId ? Number(teamForm.seasonId) : null,
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
      setCoachForm({ name: "", email: "", phone: "" });
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
      setCoachModalOpen(false);
      setEditingCoachId(null);
      setCoachForm({ name: "", email: "", phone: "" });
      await loadCoaches();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteCoach = async (coachId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/coaches/${coachId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await loadCoaches();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleOpenAssignCoach = async (coach) => {
    setAssignCoachId(coach.id);
    setAssignTeamId("");
    setAssignSeasonId(activeSeason?.id ? String(activeSeason.id) : "");
    setAssignCoachRole("");
    setAssignCoachModalOpen(true);
    await loadCoachAssignments(coach.id);
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
          coach_id: Number(assignCoachId),
          team_id: Number(assignTeamId),
          season_id: assignSeasonId ? Number(assignSeasonId) : undefined,
          role: assignCoachRole.trim(),
        }),
      });
      await loadCoachAssignments(assignCoachId);
      await loadCoaches();
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
      await loadCoachAssignments(assignCoachId);
      await loadCoaches();
    } catch (error) {
      setDataError(error.message);
    }
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

  const openOrganizationDrawer = (org = null, mode = "view") => {
    setOrgDraft({
      id: org?.id || null,
      name: org?.name || "",
      type: org?.type || "school",
      parentId: org?.parent_id ? String(org.parent_id) : "",
      status: org?.status || "active",
    });
    setOrgDrawerMode(mode);
    setOrgDrawerOpen(true);
  };

  const handleSaveOrganization = async () => {
    if (!orgDraft.name.trim()) {
      setDataError("Organization name is required.");
      return;
    }
    if (!orgDraft.type) {
      setDataError("Organization type is required.");
      return;
    }

    try {
      setDataError("");
      if (orgDrawerMode === "create") {
        await apiRequest("/api/admin/organizations", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            name: orgDraft.name.trim(),
            type: orgDraft.type,
            parent_id: orgDraft.parentId ? Number(orgDraft.parentId) : null,
            status: orgDraft.status || "active",
          }),
        });
      } else if (orgDraft.id) {
        await apiRequest(`/api/admin/organizations/${orgDraft.id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            name: orgDraft.name.trim(),
            type: orgDraft.type,
            parent_id: orgDraft.parentId ? Number(orgDraft.parentId) : null,
            status: orgDraft.status || "active",
          }),
        });
      }
      await loadOrganizations();
      setOrgDrawerOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteOrganization = async (organizationId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/organizations/${organizationId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await loadOrganizations();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const toggleOrganizationSelection = (id) => {
    setSelectedOrganizationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAllOrganizations = () => {
    if (allOrganizationsSelected) {
      setSelectedOrganizationIds([]);
    } else {
      setSelectedOrganizationIds(filteredOrganizations.map((org) => org.id));
    }
  };

  const handleBulkArchiveOrganizations = async () => {
    if (selectedOrganizationIds.length === 0) return;
    try {
      setDataError("");
      await Promise.all(
        selectedOrganizationIds.map((id) =>
          apiRequest(`/api/admin/organizations/${id}`, {
            method: "DELETE",
            headers: authHeaders,
          })
        )
      );
      setSelectedOrganizationIds([]);
      await loadOrganizations();
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
    { label: "Organizations", value: schools.length },
    { label: "Groups", value: districts.length },
    { label: "Teams", value: teams.length },
    { label: "Coaches", value: coaches.length },
    { label: "Contacts", value: totalContacts },
    { label: "Practices", value: practices.length },
    { label: "Surveys", value: surveys.length },
    { label: "Responses", value: responses.length },
  ];

  const headerMetaItems = [
    { label: "Active Survey", value: selectedSurvey?.title || "—" },
    { label: "Active Season", value: activeSeason?.name || "—" },
    { label: "Organization Focus", value: selectedSchool?.name || "All organizations" },
    { label: "Team Focus", value: selectedTeam?.name || "All teams" },
  ];

  const overviewAlerts = useMemo(() => {
    const items = [];
    if (schools.length === 0) {
      items.push({
        title: "No organizations yet",
        body: "Add your first organization to start tracking teams and contacts.",
      });
    }
    if (teams.length === 0) {
      items.push({
        title: "No teams created",
        body: "Create teams to start tracking rosters, coaches, and practices.",
      });
    }
    if (surveys.length === 0) {
      items.push({
        title: "No survey templates",
        body: "Create a survey template to begin collecting coach feedback.",
      });
    }
    if (invites.length === 0) {
      items.push({
        title: "No invite activity",
        body: "Generate invite links when you are ready to collect responses.",
      });
    }
    return items;
  }, [schools.length, teams.length, surveys.length, invites.length]);

  const recentInvites = useMemo(() => invites.slice(0, 5), [invites]);
  const recentResponses = useMemo(() => responses.slice(0, 5), [responses]);

  const overviewStats = [
    { label: "Organizations", value: schools.length },
    { label: "Teams", value: teams.length },
    { label: "Coaches", value: coaches.length },
    { label: "Contacts", value: totalContacts },
    { label: "Surveys", value: surveys.length },
    { label: "Campaigns", value: invites.length },
    { label: "Responses", value: responses.length },
    { label: "Practices", value: practices.length },
  ];

  const orgReadOnly = orgDrawerMode === "view";


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
          <DashboardHeader
            token={token}
            activeLabel={activeLabel}
            headerMetaItems={headerMetaItems}
            kpiStats={kpiStats}
            onMenuToggle={handleDrawerToggle}
            classes={classes}
            logoSrc={DauntlessAthleticsLogoDesktopCircleImg}
          />

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
              {activeSection === "overview" && (
                <OverviewSection
                  classes={classes}
                  stats={overviewStats}
                  alerts={overviewAlerts}
                  onNewOrganization={() => openOrganizationDrawer(null, "create")}
                  onAddTeam={() => {
                    setEditingTeamId(null);
                    setTeamForm({
                      ...emptyTeam,
                      seasonId: activeSeason?.id ? String(activeSeason.id) : "",
                    });
                    setTeamModalOpen(true);
                  }}
                  onCreateSurvey={() => {
                    setNewSurveyTitle("");
                    setNewSurveyDescription("");
                    setNewSurveyCommentPrompt("");
                    setNewSurveyQuestions([{ text: "" }]);
                    setSurveyCreateOpen(true);
                  }}
                  onGenerateInvites={() => setInviteModalOpen(true)}
                  onAddCoach={() => handleOpenCoachModal()}
                  onAddContact={() => {
                    setEditingContactId(null);
                    setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId || selectedTeamId || "" }));
                    setContactModalOpen(true);
                  }}
                  inviteDisabled={schools.length === 0 || surveys.length === 0}
                  contactDisabled={teams.length === 0}
                  recentInvites={recentInvites}
                  recentResponses={recentResponses}
                  formatDate={formatDate}
                />
              )}

              {activeSection === "clients" && (
                <OrganizationsSection
                  classes={classes}
                  organizationSearch={organizationSearch}
                  onOrganizationSearchChange={setOrganizationSearch}
                  organizationTypeFilter={organizationTypeFilter}
                  onOrganizationTypeFilterChange={setOrganizationTypeFilter}
                  organizationParentFilter={organizationParentFilter}
                  onOrganizationParentFilterChange={setOrganizationParentFilter}
                  organizationStatusFilter={organizationStatusFilter}
                  onOrganizationStatusFilterChange={setOrganizationStatusFilter}
                  organizationTypeOptions={organizationTypeOptions}
                  districts={districts}
                  filteredOrganizations={filteredOrganizations}
                  selectedOrganizationIds={selectedOrganizationIds}
                  allOrganizationsSelected={allOrganizationsSelected}
                  onToggleAllOrganizations={handleToggleAllOrganizations}
                  onToggleOrganizationSelection={toggleOrganizationSelection}
                  onBulkArchive={handleBulkArchiveOrganizations}
                  onClearSelection={() => setSelectedOrganizationIds([])}
                  onNewOrganization={() => openOrganizationDrawer(null, "create")}
                  onViewOrganization={(org) => openOrganizationDrawer(org, "view")}
                  onEditOrganization={(org) => openOrganizationDrawer(org, "edit")}
                  onDeleteOrganization={handleDeleteOrganization}
                  teamCountByOrg={teamCountByOrg}
                  districtMap={districtMap}
                  organizationTypeMap={organizationTypeMap}
                  formatDate={formatDate}
                />
              )}

              {activeSection === "teams" && (
                <TeamsSection
                  classes={classes}
                  onAddTeam={() => {
                    setEditingTeamId(null);
                    setTeamForm({
                      ...emptyTeam,
                      seasonId: activeSeason?.id ? String(activeSeason.id) : "",
                    });
                    setTeamModalOpen(true);
                  }}
                  teamSearch={teamSearch}
                  onTeamSearchChange={setTeamSearch}
                  teamOrgFilter={teamOrgFilter}
                  onTeamOrgFilterChange={setTeamOrgFilter}
                  teamSeasonFilter={teamSeasonFilter}
                  onTeamSeasonFilterChange={setTeamSeasonFilter}
                  schools={schools}
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
              )}

              {activeSection === "people" && (
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
                  onAddContact={() => {
                    setEditingContactId(null);
                    setContactForm((prev) => ({ ...emptyContact, teamId: prev.teamId || selectedTeamId || "" }));
                    setContactModalOpen(true);
                  }}
                  filteredCoaches={filteredCoaches}
                  filteredContacts={filteredContacts}
                  onAssignCoach={handleOpenAssignCoach}
                  onEditCoach={handleOpenCoachModal}
                  onDeleteCoach={handleDeleteCoach}
                  onEditContact={handleEditContact}
                  onDeleteContact={handleDeleteContact}
                />
              )}

              {activeSection === "surveys" && (
                <SurveysSection
                  classes={classes}
                  surveySearch={surveySearch}
                  onSurveySearchChange={setSurveySearch}
                  filteredSurveys={filteredSurveys}
                  onCreateSurvey={() => {
                    setNewSurveyTitle("");
                    setNewSurveyDescription("");
                    setNewSurveyCommentPrompt("");
                    setNewSurveyQuestions([{ text: "" }]);
                    setSurveyCreateOpen(true);
                  }}
                  onEditSurvey={handleStartEditSurvey}
                  onToggleSurveyActive={handleToggleSurveyActive}
                  onDeleteSurvey={handleDeleteSurvey}
                />
              )}

              {activeSection === "campaigns" && (
                <CampaignsSection
                  classes={classes}
                  selectedSurveyId={selectedSurveyId}
                  onSelectedSurveyChange={setSelectedSurveyId}
                  selectedSchoolId={selectedSchoolId}
                  onSelectedSchoolChange={setSelectedSchoolId}
                  inviteSurveyOptions={inviteSurveyOptions}
                  inviteSchoolOptions={inviteSchoolOptions}
                  onGenerateLinks={() => setInviteModalOpen(true)}
                  generateDisabled={schools.length === 0 || surveys.length === 0}
                  latestInvites={latestInvites}
                  allInvitesSelected={allInvitesSelected}
                  selectedInviteIds={selectedInviteIds}
                  onToggleAllInvites={handleToggleAllInvites}
                  onToggleInvite={toggleInviteSelection}
                  onCopySelected={handleCopySelectedInvites}
                  getInviteText={getInviteText}
                  onCopyInvite={copyToClipboard}
                  invites={invites}
                  formatDate={formatDate}
                  onRegenerateInvite={handleRegenerateInvite}
                  onReopenInvite={handleReopenInvite}
                  onDeleteInvite={handleDeleteInvite}
                />
              )}

              {activeSection === "responses" && (
                <ResponsesSection
                  classes={classes}
                  selectedSurveyId={selectedSurveyId}
                  onSelectedSurveyChange={setSelectedSurveyId}
                  selectedSchoolId={selectedSchoolId}
                  onSelectedSchoolChange={setSelectedSchoolId}
                  inviteSurveyOptions={inviteSurveyOptions}
                  inviteSchoolOptions={inviteSchoolOptions}
                  responses={responses}
                  onViewResponse={setResponseDetail}
                  formatDate={formatDate}
                />
              )}
            </>
          )}
        </Container>

        <OrganizationDrawer
          open={orgDrawerOpen}
          onClose={() => setOrgDrawerOpen(false)}
          classes={classes}
          orgDrawerMode={orgDrawerMode}
          orgDraft={orgDraft}
          onDraftChange={setOrgDraft}
          organizationTypeOptions={organizationTypeOptions}
          districts={districts}
          readOnly={orgReadOnly}
          onSave={handleSaveOrganization}
          onEdit={() => setOrgDrawerMode("edit")}
        />

        <Dialog
          open={districtModalOpen}
          onClose={() => {
            if (editingDistrictId) {
              handleCancelEditDistrict();
            } else {
              setDistrictModalOpen(false);
            }
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
        >
          <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            {editingDistrictId ? "Edit Organization" : "Add Organization"}
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: "12px" }}>
            <TextField
              select
              label="Organization type"
              value={editingDistrictId ? editingDistrictType : newDistrictType}
              onChange={(event) =>
                editingDistrictId
                  ? setEditingDistrictType(event.target.value)
                  : setNewDistrictType(event.target.value)
              }
              sx={classes.input}
            >
              {organizationTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Organization name"
              value={editingDistrictId ? editingDistrictName : newDistrictName}
              onChange={(event) =>
                editingDistrictId
                  ? setEditingDistrictName(event.target.value)
                  : setNewDistrictName(event.target.value)
              }
              sx={classes.input}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              sx={{ color: "var(--color-text)" }}
              onClick={() => {
                if (editingDistrictId) {
                  handleCancelEditDistrict();
                } else {
                  setDistrictModalOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={classes.button}
              onClick={() => {
                if (editingDistrictId) {
                  handleSaveDistrict();
                } else {
                  handleCreateDistrict();
                }
              }}
            >
              {editingDistrictId ? "Save Organization" : "Add Organization"}
            </Button>
          </DialogActions>
        </Dialog>

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
            {editingSchoolId ? "Edit Location" : "Add Location"}
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: "12px" }}>
            <TextField
              select
              label="Location type"
              value={editingSchoolId ? editingSchoolType : newSchoolType}
              onChange={(event) =>
                editingSchoolId
                  ? setEditingSchoolType(event.target.value)
                  : setNewSchoolType(event.target.value)
              }
              sx={classes.input}
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
              value={editingSchoolId ? editingSchoolDistrictId : newSchoolDistrictId}
              onChange={(event) =>
                editingSchoolId
                  ? setEditingSchoolDistrictId(event.target.value)
                  : setNewSchoolDistrictId(event.target.value)
              }
              sx={classes.input}
            >
              {districtOptions.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Location name"
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
              {editingSchoolId ? "Save Location" : "Add Location"}
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
            <Button
              variant="contained"
              sx={classes.button}
              onClick={() => {
                if (editingSeasonId) {
                  handleSaveSeason();
                } else {
                  handleCreateSeason();
                }
              }}
            >
              {editingSeasonId ? "Save Season" : "Add Season"}
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
              label="Organization (optional)"
              value={teamForm.organizationId}
              onChange={(event) =>
                setTeamForm((prev) => ({ ...prev, organizationId: event.target.value }))
              }
              sx={classes.input}
            >
              <MenuItem value="">No organization selected</MenuItem>
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
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
          open={coachModalOpen}
          onClose={() => {
            setCoachModalOpen(false);
            setEditingCoachId(null);
            setCoachForm({ name: "", email: "", phone: "" });
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
            <Divider sx={{ borderColor: "var(--color-border)" }} />
            <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Current Assignments</Typography>
            {coachAssignments.length === 0 ? (
              <Typography sx={{ color: "var(--color-muted)" }}>No assignments yet.</Typography>
            ) : (
              <TableContainer component={Paper} sx={classes.tablePaper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Season</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Role</TableCell>
                      <TableCell sx={classes.tableHeadCell} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coachAssignments.map((assignment) => (
                      <TableRow key={`${assignment.coach_id}-${assignment.team_id}-${assignment.season_id || "0"}`} hover>
                        <TableCell sx={{ color: "var(--color-text)" }}>{assignment.team_name}</TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {assignment.season_name || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>{assignment.role || "—"}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ color: "var(--color-text)" }}
                            onClick={() => handleRemoveCoachAssignment(assignment)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
              label="Organization"
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
                {responseDetail.organization_name}
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
