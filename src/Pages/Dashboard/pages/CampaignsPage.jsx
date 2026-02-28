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
import CampaignsSection from "../../../Components/Dashboard/CampaignsSection";
import classes from "../dashboardStyles";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setInvites, setOrganizations, setSurveys, setTeams } from "../../../store/dashboardSlice";
import OrganizationTeamMultiSelect from "../../../Components/Dashboard/OrganizationTeamMultiSelect";

export default function CampaignsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const teams = useSelector((state) => state.dashboard.teams);
  const invites = useSelector((state) => state.dashboard.invites);
  const [dataError, setDataError] = useState("");
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState([]);
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

  const handleCreateInvites = async () => {
    if (selectedOrganizationIds.length === 0) {
      setDataError("Select at least one organization before generating invite links.");
      return;
    }
    if (!selectedSurveyId) {
      setDataError("Select a survey before generating invite links.");
      return;
    }
    try {
      setDataError("");
      const results = await Promise.all(
        selectedOrganizationIds.map((orgId) =>
          apiRequest("/api/admin/invites", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              organization_id: Number(orgId),
              survey_id: Number(selectedSurveyId),
              count: Number(inviteCount),
            }),
          })
        )
      );
      const createdInvites = results.flatMap((result) => result.invites || []);
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
      setLatestInvites(result.invites || []);
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
    if (selectedOrganizationIds.length > 0) {
      items = items.filter((invite) =>
        selectedOrganizationIds.includes(String(invite.organization_id))
      );
    }
    return items;
  }, [invites, selectedOrganizationIds]);

  const handleOrganizationsChange = (orgIds) => {
    setSelectedOrganizationIds(orgIds);
    if (orgIds.length === 0) {
      setSelectedTeamIds([]);
      return;
    }
    setSelectedTeamIds((prev) =>
      prev.filter((teamId) => {
        const team = teams.find((item) => String(item.id) === String(teamId));
        return team && orgIds.includes(String(team.organization_id));
      })
    );
  };

  const handleToggleTeam = (team) => {
    const teamId = String(team.id);
    const orgId = String(team.organization_id || "");
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
    if (orgId) {
      setSelectedOrganizationIds((prev) =>
        prev.includes(orgId) ? prev : [...prev, orgId]
      );
    }
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <CampaignsSection
        classes={classes}
        selectedSurveyId={selectedSurveyId}
        onSelectedSurveyChange={setSelectedSurveyId}
        selectedOrganizationIds={selectedOrganizationIds}
        onSelectedOrganizationsChange={handleOrganizationsChange}
        selectedTeamIds={selectedTeamIds}
        teamsByOrganization={teamsByOrganization}
        onToggleTeam={handleToggleTeam}
        inviteSurveyOptions={inviteSurveyOptions}
        organizationOptions={organizationOptions}
        onGenerateLinks={() => setInviteModalOpen(true)}
        generateDisabled={organizations.length === 0 || surveys.length === 0}
        latestInvites={latestInvites}
        allInvitesSelected={allInvitesSelected}
        selectedInviteIds={selectedInviteIds}
        onToggleAllInvites={handleToggleAllInvites}
        onToggleInvite={toggleInviteSelection}
        onCopySelected={handleCopySelectedInvites}
        getInviteText={getInviteText}
        onCopyInvite={copyToClipboard}
        invites={filteredInvites}
        formatDate={formatDate}
        onRegenerateInvite={handleRegenerateInvite}
        onReopenInvite={handleReopenInvite}
        onDeleteInvite={handleDeleteInvite}
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
            label="Organizations"
            organizationOptions={organizationOptions}
            teamsByOrganization={teamsByOrganization}
            selectedOrganizationIds={selectedOrganizationIds}
            onOrganizationsChange={handleOrganizationsChange}
            selectedTeamIds={selectedTeamIds}
            onToggleTeam={handleToggleTeam}
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
            Invite links are single-use and tied to the selected survey and organization.
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
            disabled={selectedOrganizationIds.length === 0 || !selectedSurveyId}
          >
            Generate Links
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
