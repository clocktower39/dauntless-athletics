import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DashboardHeader from "../../../Components/Dashboard/DashboardHeader";
import OverviewSection from "../../../Components/Dashboard/OverviewSection";
import classes from "../dashboardStyles";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import {
  setInvites,
  setOrganizations,
  setPractices,
  setResponses,
  setSeasons,
  setSurveys,
  setTeams,
} from "../../../store/dashboardSlice";
import DauntlessAthleticsLogoDesktopCircleImg from "../../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

export default function OverviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const seasons = useSelector((state) => state.dashboard.seasons);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const invites = useSelector((state) => state.dashboard.invites);
  const responses = useSelector((state) => state.dashboard.responses);
  const practices = useSelector((state) => state.dashboard.practices);
  const [dataError, setDataError] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, teamRes, seasonRes, surveyRes, inviteRes, responseRes, practiceRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/seasons", { headers: authHeaders }),
          apiRequest("/api/admin/surveys", { headers: authHeaders }),
          apiRequest("/api/admin/invites", { headers: authHeaders }),
          apiRequest("/api/admin/responses", { headers: authHeaders }),
          apiRequest("/api/admin/practices", { headers: authHeaders }),
        ]);
        if (!isMounted) return;
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setTeams(teamRes.teams || []));
        dispatch(setSeasons(seasonRes.seasons || []));
        dispatch(setSurveys(surveyRes.surveys || []));
        dispatch(setInvites(inviteRes.invites || []));
        dispatch(setResponses(responseRes.responses || []));
        dispatch(setPractices(practiceRes.practices || []));
      } catch (error) {
        if (isMounted) setDataError(error.message);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [token, authHeaders, dispatch]);

  const activeSeason = useMemo(
    () => seasons.find((season) => season.is_active) || null,
    [seasons]
  );

  const totalContacts = useMemo(
    () => teams.reduce((sum, team) => sum + (team.contact_count || 0), 0),
    [teams]
  );

  const headerMetaItems = useMemo(
    () => [
      { label: "Active Season", value: activeSeason?.name || "Not set" },
      { label: "Organizations", value: organizations.length },
      { label: "Teams", value: teams.length },
    ],
    [activeSeason?.name, organizations.length, teams.length]
  );

  const kpiStats = useMemo(
    () => [
      { label: "Surveys", value: surveys.length },
      { label: "Campaigns", value: invites.length },
      { label: "Responses", value: responses.length },
      { label: "Practices", value: practices.length },
      { label: "Contacts", value: totalContacts },
    ],
    [surveys.length, invites.length, responses.length, practices.length, totalContacts]
  );

  const overviewAlerts = useMemo(() => {
    const items = [];
    if (organizations.length === 0) {
      items.push({
        title: "No organizations yet",
        body: "Add your first organization to start tracking teams and contacts.",
      });
    }
    if (teams.length === 0) {
      items.push({
        title: "No teams created",
        body: "Create teams to start tracking rosters, contacts, and practices.",
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
  }, [organizations.length, teams.length, surveys.length, invites.length]);

  const overviewStats = useMemo(
    () => [
      { label: "Organizations", value: organizations.length },
      { label: "Teams", value: teams.length },
      { label: "Contacts", value: totalContacts },
      { label: "Surveys", value: surveys.length },
      { label: "Campaigns", value: invites.length },
      { label: "Responses", value: responses.length },
      { label: "Practices", value: practices.length },
    ],
    [organizations.length, teams.length, totalContacts, surveys.length, invites.length, responses.length, practices.length]
  );

  const recentInvites = useMemo(() => invites.slice(0, 5), [invites]);
  const recentResponses = useMemo(() => responses.slice(0, 5), [responses]);

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <DashboardHeader
        token={token}
        activeLabel="Overview"
        headerMetaItems={headerMetaItems}
        kpiStats={kpiStats}
        onMenuToggle={null}
        classes={classes}
        logoSrc={DauntlessAthleticsLogoDesktopCircleImg}
      />
      <OverviewSection
        classes={classes}
        stats={overviewStats}
        alerts={overviewAlerts}
        onNewOrganization={() => navigate("/dashboard/organizations/new")}
        onAddTeam={() => navigate("/dashboard/teams/new")}
        onCreateSurvey={() => navigate("/dashboard/surveys/new")}
        onGenerateInvites={() => navigate("/dashboard/campaigns?new=1")}
        onAddContact={() => navigate("/dashboard/people/new")}
        inviteDisabled={organizations.length === 0 || surveys.length === 0}
        contactDisabled={teams.length === 0}
        recentInvites={recentInvites}
        recentResponses={recentResponses}
        formatDate={formatDate}
      />
    </Box>
  );
}
