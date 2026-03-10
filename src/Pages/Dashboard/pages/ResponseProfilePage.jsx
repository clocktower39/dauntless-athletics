import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import classes from "../dashboardStyles";
import { formatDate, ratingLabelMap } from "../dashboardUtils";
import { apiRequest, authHeader } from "../surveyApi";
import { setOrganizations, setResponses, setSurveys } from "../../../store/dashboardSlice";

export default function ResponseProfilePage() {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const responses = useSelector((state) => state.dashboard.responses);
  const [dataError, setDataError] = useState("");

  const responseIdNumber = Number(responseId);
  const authHeaders = useMemo(() => authHeader(token), [token]);

  const response = useMemo(
    () => responses.find((item) => Number(item.id) === responseIdNumber) || null,
    [responses, responseIdNumber]
  );

  const survey = useMemo(
    () => surveys.find((item) => Number(item.id) === Number(response?.survey_id)) || null,
    [surveys, response]
  );

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, surveyRes, responseRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/surveys", { headers: authHeaders }),
          apiRequest("/api/admin/responses", { headers: authHeaders }),
        ]);
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setSurveys(surveyRes.surveys || []));
        dispatch(setResponses(responseRes.responses || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  const organizationLabel = response?.organization_name || organizations.find((org) => org.id === response?.organization_id)?.name || "—";

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Response Detail</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Responses / Detail</Typography>
          </Box>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/responses")}>
            Back to list
          </Button>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />

        {!response ? (
          <Typography sx={{ color: "var(--color-muted)" }}>Response not found.</Typography>
        ) : (
          <Box sx={{ display: "grid", gap: "12px" }}>
            <Box>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {response.team_name || organizationLabel}
              </Typography>
              {response.team_name && organizationLabel && (
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                  {organizationLabel}
                </Typography>
              )}
            </Box>
            {response.survey_title && (
              <Typography sx={{ color: "var(--color-muted)" }}>{response.survey_title}</Typography>
            )}
            <Typography sx={{ color: "var(--color-muted)" }}>{formatDate(response.created_at)}</Typography>
            <Divider sx={{ borderColor: "var(--color-border)" }} />
            {(survey?.questions || []).map((question) => (
              <Box key={question.id} sx={{ display: "grid", gap: "4px" }}>
                <Typography sx={{ color: "var(--color-text)" }}>{question.text}</Typography>
                <Typography sx={{ color: "var(--color-accent)" }}>
                  {ratingLabelMap[response?.answers?.[question.id]] || response?.answers?.[question.id] || "n/a"}
                </Typography>
              </Box>
            ))}
            {response.comment && (
              <Box>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>Comments</Typography>
                <Typography sx={{ color: "var(--color-muted)" }}>{response.comment}</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
