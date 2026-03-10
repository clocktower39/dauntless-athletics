import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ResponsesSection from "../../../Components/Dashboard/ResponsesSection";
import classes from "../dashboardStyles";
import { formatDate } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setOrganizations, setResponses, setSurveys } from "../../../store/dashboardSlice";

export default function ResponsesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const responses = useSelector((state) => state.dashboard.responses);
  const [dataError, setDataError] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const inviteSchoolOptions = useMemo(() => [{ id: "", name: "Select organization" }, ...organizations], [organizations]);
  const inviteSurveyOptions = useMemo(() => [{ id: "", title: "Select survey" }, ...surveys], [surveys]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, surveyRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/surveys", { headers: authHeaders }),
        ]);
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setSurveys(surveyRes.surveys || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

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

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
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
    </Box>
  );
}
