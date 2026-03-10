import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import SurveysSection from "../../../Components/Dashboard/SurveysSection";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setSurveys } from "../../../store/dashboardSlice";

export default function SurveysPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const [dataError, setDataError] = useState("");
  const [surveySearch, setSurveySearch] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const filteredSurveys = useMemo(() => {
    const term = surveySearch.trim().toLowerCase();
    if (!term) return surveys;
    return surveys.filter((survey) => survey.title?.toLowerCase().includes(term));
  }, [surveys, surveySearch]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const result = await apiRequest("/api/admin/surveys", { headers: authHeaders });
        dispatch(setSurveys(result.surveys || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

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

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <SurveysSection
        classes={classes}
        surveySearch={surveySearch}
        onSurveySearchChange={setSurveySearch}
        filteredSurveys={filteredSurveys}
        onNewSurvey={() => navigate("/dashboard/surveys/new")}
        onEditSurvey={(survey) => navigate(`/dashboard/surveys/${survey.id}?edit=1`)}
        onDeleteSurvey={handleDeleteSurvey}
      />
    </Box>
  );
}
