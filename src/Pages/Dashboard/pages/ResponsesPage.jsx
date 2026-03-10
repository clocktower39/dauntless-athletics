import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ResponsesSection from "../../../Components/Dashboard/ResponsesSection";
import classes from "../dashboardStyles";
import { formatDate, ratingLabelMap } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setOrganizations, setResponses, setSurveys } from "../../../store/dashboardSlice";

export default function ResponsesPage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const responses = useSelector((state) => state.dashboard.responses);
  const [dataError, setDataError] = useState("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [responseDetail, setResponseDetail] = useState(null);

  const authHeaders = useMemo(() => authHeader(token), [token]);

  const inviteSchoolOptions = useMemo(() => [{ id: "", name: "Select organization" }, ...organizations], [organizations]);
  const inviteSurveyOptions = useMemo(() => [{ id: "", title: "Select survey" }, ...surveys], [surveys]);

  const selectedSurvey = useMemo(
    () => surveys.find((survey) => String(survey.id) === String(selectedSurveyId)) || null,
    [surveys, selectedSurveyId]
  );

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
        onViewResponse={setResponseDetail}
        formatDate={formatDate}
      />

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
                {responseDetail.team_name || responseDetail.organization_name || "—"}
                {responseDetail.team_name && responseDetail.organization_name && (
                  <Typography sx={{ color: "var(--color-muted)", fontSize: "0.78rem" }}>
                    {responseDetail.organization_name}
                  </Typography>
                )}
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
  );
}
