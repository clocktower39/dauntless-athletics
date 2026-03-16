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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import SurveysSection from "../../../Components/Dashboard/SurveysSection";
import CampaignsSection from "../../../Components/Dashboard/CampaignsSection";
import ResponsesSection from "../../../Components/Dashboard/ResponsesSection";
import classes from "../dashboardStyles";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import {
  setInvites,
  setOrganizations,
  setResponses,
  setSurveys,
  setTeams,
} from "../../../store/dashboardSlice";
import OrganizationTeamMultiSelect from "../../../Components/Dashboard/OrganizationTeamMultiSelect";
import MessagePrepPage from "./MessagePrepPage";

const sectionOptions = [
  { value: "templates", label: "Templates" },
  { value: "campaigns", label: "Campaigns" },
  { value: "responses", label: "Responses" },
  { value: "messages", label: "Message Prep" },
];

export default function SurveysHubPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const teams = useSelector((state) => state.dashboard.teams);
  const invites = useSelector((state) => state.dashboard.invites);
  const responses = useSelector((state) => state.dashboard.responses);
  const [dataError, setDataError] = useState("");
  const [surveySearch, setSurveySearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("templates");
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [inviteCount, setInviteCount] = useState(1);
  const [latestInvites, setLatestInvites] = useState([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const organizationOptions = useMemo(() => organizations, [organizations]);
  const inviteSurveyOptions = useMemo(() => [{ id: "", title: "Select survey" }, ...surveys], [surveys]);
  const inviteSchoolOptions = useMemo(() => [{ id: "", name: "Select organization" }, ...organizations], [organizations]);
  const teamsByOrganization = useMemo(
    () =>
      teams.reduce((acc, team) => {
        const orgId = team.organization_id ? String(team.organization_id) : "";
        if (!orgId) return acc;
        if (!acc[orgId]) acc[orgId] = [];
        acc[orgId].push(team);
        return acc;
      }, {}),
    [teams]
  );
  const teamNameById = useMemo(() => new Map(teams.map((team) => [String(team.id), team.name])), [teams]);

  const filteredSurveys = useMemo(() => {
    const term = surveySearch.trim().toLowerCase();
    if (!term) return surveys;
    return surveys.filter((survey) => survey.title?.toLowerCase().includes(term));
  }, [surveys, surveySearch]);

  const filteredInvites = useMemo(() => {
    let items = invites;
    if (selectedTeamIds.length > 0) {
      items = items.filter((invite) => selectedTeamIds.includes(String(invite.team_id)));
    }
    return items;
  }, [invites, selectedTeamIds]);

  const allInvitesSelected = latestInvites.length > 0 && selectedInviteIds.length === latestInvites.length;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (sectionOptions.some((option) => option.value === section)) {
      setSelectedSection(section);
    }
    if (params.get("new") === "1") {
      setSelectedSection("campaigns");
      setInviteModalOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, surveyRes, teamRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/surveys", { headers: authHeaders }),
          apiRequest("/api/admin/teams", { headers: authHeaders }),
        ]);
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setSurveys(surveyRes.surveys || []));
        dispatch(setTeams(teamRes.teams || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (!token) return;
    const loadInvites = async () => {
      try {
        const params = [];
        if (selectedSurveyId) params.push(`survey_id=${selectedSurveyId}`);
        const query = params.length > 0 ? `?${params.join("&")}` : "";
        const result = await apiRequest(`/api/admin/invites${query}`, { headers: authHeaders });
        dispatch(setInvites(result.invites || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadInvites();
  }, [token, selectedSurveyId, authHeaders, dispatch]);

  useEffect(() => {
    if (!token) return;
    const loadResponses = async () => {
      try {
        const params = [];
        if (selectedOrganizationId) params.push(`organization_id=${selectedOrganizationId}`);
        if (selectedSurveyId) params.push(`survey_id=${selectedSurveyId}`);
        const query = params.length ? `?${params.join("&")}` : "";
        const result = await apiRequest(`/api/admin/responses${query}`, { headers: authHeaders });
        dispatch(setResponses(result.responses || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadResponses();
  }, [token, selectedOrganizationId, selectedSurveyId, authHeaders, dispatch]);

  const handleSectionChange = (_event, nextSection) => {
    if (!nextSection) return;
    setSelectedSection(nextSection);
    const params = new URLSearchParams(location.search);
    params.set("section", nextSection);
    params.delete("new");
    navigate(`/dashboard/surveys?${params.toString()}`, { replace: true });
  };

  const getInviteText = (invite) => {
    if (!invite) return "";
    const isLocalhost =
      typeof window !== "undefined" &&
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
    } catch (_error) {
      setDataError("Unable to copy to clipboard.");
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${surveyId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const result = await apiRequest("/api/admin/surveys", { headers: authHeaders });
      dispatch(setSurveys(result.surveys || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const toggleInviteSelection = (inviteId) => {
    setSelectedInviteIds((prev) =>
      prev.includes(inviteId) ? prev.filter((item) => item !== inviteId) : [...prev, inviteId]
    );
  };

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
    await copyToClipboard(selected.map(getInviteText).filter(Boolean).join("\n"));
  };

  const handleCopySelectedInvitesAsObject = async () => {
    const selected = latestInvites.filter((invite) => selectedInviteIds.includes(invite.id));
    if (selected.length === 0) {
      setDataError("Select at least one link to copy.");
      return;
    }
    const closeDate = "April 15, 2026";
    const payload = selected
      .map((invite) => {
        const team =
          invite.team_name ||
          (invite.team_id ? teamNameById.get(String(invite.team_id)) : "") ||
          invite.organization_name ||
          "Unknown team";
        const link = getInviteText(invite);
        const teamLabel = team === "Unknown team" ? "your team" : team;
        const surveyTitle = invite.survey_title || "Dauntless Athletics Coach Survey";
        return {
          team,
          team_id: invite.team_id || null,
          link,
          survey: invite.survey_title || undefined,
          email_subject: `${surveyTitle} — ${teamLabel}`,
          email_body: [
            `Hi ${teamLabel} Coach/Team,`,
            "",
            "We’re collecting feedback to improve our cheer programs.",
            `Please complete the survey by ${closeDate}.`,
            "",
            `Survey link: ${link}`,
            "",
            "This link is unique and one-time use.",
            "",
            "Thank you,",
            "Dauntless Athletics",
          ].join("\n"),
          text_message: `Dauntless Athletics ${surveyTitle} for ${teamLabel}: ${link} (one-time link). Please complete by ${closeDate}. Thank you!`,
        };
      })
      .filter((entry) => entry.link);
    await copyToClipboard(JSON.stringify(payload, null, 2));
  };

  const loadInvites = async (surveyId) => {
    const params = [];
    if (surveyId) params.push(`survey_id=${surveyId}`);
    const query = params.length > 0 ? `?${params.join("&")}` : "";
    const result = await apiRequest(`/api/admin/invites${query}`, { headers: authHeaders });
    dispatch(setInvites(result.invites || []));
  };

  const handleCreateInvites = async () => {
    if (selectedTeamIds.length === 0) {
      setDataError("Select at least one team before generating invite links.");
      return;
    }
    if (!selectedSurveyId) {
      setDataError("Select a survey before generating invite links.");
      return;
    }
    try {
      setDataError("");
      const results = await Promise.all(
        selectedTeamIds.map((teamId) =>
          apiRequest("/api/admin/invites", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              team_id: Number(teamId),
              survey_id: Number(selectedSurveyId),
              count: Number(inviteCount),
            }),
          })
        )
      );
      const createdInvites = results.flatMap((result) =>
        (result.invites || []).map((invite) => ({
          ...invite,
          team_id: result.team?.id,
          team_name: result.team?.name,
          organization_id: result.organization?.id,
          organization_name: result.organization?.name,
          survey_id: result.survey?.id,
          survey_title: result.survey?.title,
          created_at: invite.created_at || invite.createdAt || null,
        }))
      );
      setLatestInvites(createdInvites);
      setSelectedInviteIds([]);
      setInviteModalOpen(false);
      await loadInvites(selectedSurveyId);
      setSelectedSection("campaigns");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleRegenerateInvite = async (inviteId) => {
    try {
      setDataError("");
      const result = await apiRequest(`/api/admin/invites/${inviteId}/regenerate`, {
        method: "POST",
        headers: authHeaders,
      });
      const regeneratedInvites = (result.invites || []).map((invite) => ({
        ...invite,
        team_id: result.team?.id,
        team_name: result.team?.name,
        organization_id: result.organization?.id,
        organization_name: result.organization?.name,
        survey_id: result.survey?.id,
        survey_title: result.survey?.title,
        created_at: invite.created_at || invite.createdAt || null,
      }));
      setLatestInvites(regeneratedInvites);
      setSelectedInviteIds([]);
      await loadInvites(selectedSurveyId);
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
      await loadInvites(selectedSurveyId);
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
      await loadInvites(selectedSurveyId);
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Surveys Workspace</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Surveys</Typography>
          </Box>
          <ToggleButtonGroup
            value={selectedSection}
            exclusive
            onChange={handleSectionChange}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
                textTransform: "none",
              },
              "& .Mui-selected": {
                backgroundColor: "rgba(215, 38, 56, 0.18) !important",
                color: "var(--color-text) !important",
              },
            }}
          >
            {sectionOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>

      {selectedSection === "templates" && (
        <SurveysSection
          classes={classes}
          surveySearch={surveySearch}
          onSurveySearchChange={setSurveySearch}
          filteredSurveys={filteredSurveys}
          onNewSurvey={() => navigate("/dashboard/surveys/new")}
          onEditSurvey={(survey) => navigate(`/dashboard/surveys/${survey.id}?edit=1`)}
          onDeleteSurvey={handleDeleteSurvey}
        />
      )}

      {selectedSection === "campaigns" && (
        <>
          <CampaignsSection
            classes={classes}
            selectedSurveyId={selectedSurveyId}
            onSelectedSurveyChange={setSelectedSurveyId}
            selectedTeamIds={selectedTeamIds}
            teamsByOrganization={teamsByOrganization}
            onSelectedTeamIdsChange={setSelectedTeamIds}
            inviteSurveyOptions={inviteSurveyOptions}
            organizationOptions={organizationOptions}
            onGenerateLinks={() => setInviteModalOpen(true)}
            generateDisabled={teams.length === 0 || surveys.length === 0}
            latestInvites={latestInvites}
            allInvitesSelected={allInvitesSelected}
            selectedInviteIds={selectedInviteIds}
            onToggleAllInvites={handleToggleAllInvites}
            onToggleInvite={toggleInviteSelection}
            onCopySelected={handleCopySelectedInvites}
            onCopySelectedAsObject={handleCopySelectedInvitesAsObject}
            getInviteText={getInviteText}
            onCopyInvite={copyToClipboard}
            invites={filteredInvites}
            formatDate={formatDate}
            onRegenerateInvite={handleRegenerateInvite}
            onReopenInvite={handleReopenInvite}
            onDeleteInvite={handleDeleteInvite}
            onViewInvite={(invite) => navigate(`/dashboard/campaigns/${invite.id}`)}
          />

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
              <OrganizationTeamMultiSelect
                classes={classes}
                label="Teams"
                organizationOptions={organizationOptions}
                teamsByOrganization={teamsByOrganization}
                selectedTeamIds={selectedTeamIds}
                onSelectedTeamIdsChange={setSelectedTeamIds}
              />
              <TextField
                label="Count"
                type="number"
                value={inviteCount}
                onChange={(event) => setInviteCount(event.target.value)}
                sx={{ ...classes.input, maxWidth: "160px" }}
                inputProps={{ min: 1, max: 50 }}
              />
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                Invite links are single-use and tied to the selected survey and team.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={classes.button}
                onClick={handleCreateInvites}
                disabled={selectedTeamIds.length === 0 || !selectedSurveyId}
              >
                Generate Links
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {selectedSection === "responses" && (
        <ResponsesSection
          classes={classes}
          selectedSurveyId={selectedSurveyId}
          onSelectedSurveyChange={setSelectedSurveyId}
          selectedSchoolId={selectedOrganizationId}
          onSelectedSchoolChange={setSelectedOrganizationId}
          inviteSurveyOptions={inviteSurveyOptions}
          inviteSchoolOptions={inviteSchoolOptions}
          responses={responses}
          onViewResponse={(response) => navigate(`/dashboard/responses/${response.id}`)}
          formatDate={formatDate}
        />
      )}

      {selectedSection === "messages" && <MessagePrepPage embedded />}
    </Box>
  );
}
