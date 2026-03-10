import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import classes from "../dashboardStyles";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setInvites, setOrganizations, setSurveys, setTeams } from "../../../store/dashboardSlice";

export default function CampaignProfilePage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const invites = useSelector((state) => state.dashboard.invites);
  const [dataError, setDataError] = useState("");

  const inviteIdNumber = Number(inviteId);
  const authHeaders = useMemo(() => authHeader(token), [token]);

  const invite = useMemo(
    () => invites.find((item) => Number(item.id) === inviteIdNumber) || null,
    [invites, inviteIdNumber]
  );

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [inviteRes, orgRes, teamRes, surveyRes] = await Promise.all([
          apiRequest("/api/admin/invites", { headers: authHeaders }),
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/surveys", { headers: authHeaders }),
        ]);
        dispatch(setInvites(inviteRes.invites || []));
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setTeams(teamRes.teams || []));
        dispatch(setSurveys(surveyRes.surveys || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  const getInviteText = (row) => {
    if (!row) return "";
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (isLocalhost && row.token) {
      return `${window.location.origin}/hs-coach-survey/${row.token}`;
    }
    return row.link || (row.token ? `${window.location.origin}/hs-coach-survey/${row.token}` : "");
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
      setDataError("Unable to copy link.");
    }
  };

  const handleRegenerate = async () => {
    if (!inviteIdNumber) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/invites/${inviteIdNumber}/regenerate`, {
        method: "POST",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/invites", { headers: authHeaders });
      dispatch(setInvites(refreshed.invites || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleReopen = async () => {
    if (!inviteIdNumber) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/invites/${inviteIdNumber}/reopen`, {
        method: "POST",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/invites", { headers: authHeaders });
      dispatch(setInvites(refreshed.invites || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!inviteIdNumber) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/invites/${inviteIdNumber}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/invites", { headers: authHeaders });
      dispatch(setInvites(refreshed.invites || []));
      navigate("/dashboard/campaigns");
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
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Campaign Detail</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Campaigns / Detail</Typography>
          </Box>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/campaigns")}>
            Back to list
          </Button>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />

        {!invite ? (
          <Typography sx={{ color: "var(--color-muted)" }}>Invite not found.</Typography>
        ) : (
          <Box sx={{ display: "grid", gap: "12px" }}>
            <Box>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {invite.team_name || invite.organization_name || "—"}
              </Typography>
              {invite.survey_title && (
                <Typography sx={{ color: "var(--color-muted)" }}>{invite.survey_title}</Typography>
              )}
              <Typography sx={{ color: "var(--color-muted)" }}>
                Created {formatDate(invite.created_at)}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: "var(--color-border)" }} />
            <Typography sx={{ color: "var(--color-muted)" }}>Invite link</Typography>
            <Typography sx={{ color: "var(--color-text)", fontFamily: "monospace" }}>
              {getInviteText(invite)}
            </Typography>
            <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => copyToClipboard(getInviteText(invite))}>
                Copy Link
              </Button>
              {!invite.used_at ? (
                <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleRegenerate}>
                  Regenerate
                </Button>
              ) : (
                <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleReopen}>
                  Reopen
                </Button>
              )}
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
