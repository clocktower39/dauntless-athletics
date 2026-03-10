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
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import CampaignsSection from "../../../Components/Dashboard/CampaignsSection";
import classes from "../dashboardStyles";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setInvites, setOrganizations, setSurveys, setTeams } from "../../../store/dashboardSlice";
import OrganizationTeamMultiSelect from "../../../Components/Dashboard/OrganizationTeamMultiSelect";

export default function CampaignsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const teams = useSelector((state) => state.dashboard.teams);
  const invites = useSelector((state) => state.dashboard.invites);
  const [dataError, setDataError] = useState("");
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [inviteCount, setInviteCount] = useState(1);
  const [latestInvites, setLatestInvites] = useState([]);
  const [selectedInviteIds, setSelectedInviteIds] = useState([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const organizationOptions = useMemo(() => organizations, [organizations]);
  const inviteSurveyOptions = useMemo(() => [{ id: "", title: "Select survey" }, ...surveys], [surveys]);
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
  const teamNameById = useMemo(
    () => new Map(teams.map((team) => [String(team.id), team.name])),
    [teams]
  );

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
    loadInvites(selectedSurveyId);
  }, [token, selectedSurveyId, authHeaders]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      setInviteModalOpen(true);
    }
  }, [location.search]);

  const loadInvites = async (surveyId) => {
    try {
      const params = [];
      if (surveyId) params.push(`survey_id=${surveyId}`);
      const query = params.length > 0 ? `?${params.join("&")}` : "";
      const result = await apiRequest(`/api/admin/invites${query}`, { headers: authHeaders });
      dispatch(setInvites(result.invites || []));
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
      prev.includes(inviteId) ? prev.filter((item) => item !== inviteId) : [...prev, inviteId]
    );
  };

  const allInvitesSelected = latestInvites.length > 0 && selectedInviteIds.length === latestInvites.length;

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
        const emailSubject = `${surveyTitle} — ${teamLabel}`;
        const emailBody = [
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
        ].join("\n");
        const textMessage = `Dauntless Athletics ${surveyTitle} for ${teamLabel}: ${link} (one-time link). Please complete by ${closeDate}. Thank you!`;

        return {
          team,
          link,
          survey: invite.survey_title || undefined,
          email_subject: emailSubject,
          email_body: emailBody,
          text_message: textMessage,
        };
      })
      .filter((entry) => entry.link);
    await copyToClipboard(JSON.stringify(payload, null, 2));
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

  const filteredInvites = useMemo(() => {
    let items = invites;
    if (selectedTeamIds.length > 0) {
      items = items.filter((invite) =>
        selectedTeamIds.includes(String(invite.team_id))
      );
    }
    return items;
  }, [invites, selectedTeamIds]);

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
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
    </Box>
  );
}
