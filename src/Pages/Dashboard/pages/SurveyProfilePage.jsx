import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setSurveys } from "../../../store/dashboardSlice";

const emptyQuestion = { text: "" };

export default function SurveyProfilePage() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const [dataError, setDataError] = useState("");
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(surveyId === "new" || startEdit ? "edit" : "view");
  const [surveyDraft, setSurveyDraft] = useState({
    id: null,
    title: "",
    description: "",
    commentPrompt: "",
    isActive: true,
    questions: [emptyQuestion],
  });

  const authHeaders = useMemo(() => authHeader(token), [token]);
  const isNew = surveyId === "new";
  const surveyIdNumber = Number(surveyId);

  const survey = useMemo(() => {
    if (isNew) return null;
    return surveys.find((item) => Number(item.id) === surveyIdNumber) || null;
  }, [surveys, surveyIdNumber, isNew]);

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

  useEffect(() => {
    if (isNew) {
      setSurveyDraft({
        id: null,
        title: "",
        description: "",
        commentPrompt: "",
        isActive: true,
        questions: [emptyQuestion],
      });
      setMode("edit");
      return;
    }
    if (survey) {
      setSurveyDraft({
        id: survey.id,
        title: survey.title || "",
        description: survey.description || "",
        commentPrompt: survey.commentPrompt || "",
        isActive: Boolean(survey.isActive),
        questions: survey.questions?.length
          ? survey.questions.map((q) => ({ text: q.text }))
          : [emptyQuestion],
      });
    }
  }, [survey, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const updateQuestionText = (index, value) => {
    setSurveyDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((question, idx) =>
        idx === index ? { ...question, text: value } : question
      ),
    }));
  };

  const addQuestion = () => {
    setSurveyDraft((prev) => ({ ...prev, questions: [...prev.questions, emptyQuestion] }));
  };

  const removeQuestion = (index) => {
    setSurveyDraft((prev) => ({
      ...prev,
      questions: prev.questions.length > 1 ? prev.questions.filter((_, idx) => idx !== index) : prev.questions,
    }));
  };

  const handleSave = async () => {
    if (!surveyDraft.title.trim()) {
      setDataError("Survey title is required.");
      return;
    }
    const cleanedQuestions = surveyDraft.questions.filter((q) => q.text.trim());
    if (cleanedQuestions.length === 0) {
      setDataError("At least one question is required.");
      return;
    }
    try {
      setDataError("");
      let savedId = surveyDraft.id;
      if (isNew) {
        const result = await apiRequest("/api/admin/surveys", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            title: surveyDraft.title.trim(),
            description: surveyDraft.description.trim(),
            commentPrompt: surveyDraft.commentPrompt.trim(),
            questions: cleanedQuestions,
          }),
        });
        savedId = result.survey?.id;
      } else if (surveyDraft.id) {
        await apiRequest(`/api/admin/surveys/${surveyDraft.id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            title: surveyDraft.title.trim(),
            description: surveyDraft.description.trim(),
            commentPrompt: surveyDraft.commentPrompt.trim(),
            isActive: surveyDraft.isActive,
          }),
        });
        await apiRequest(`/api/admin/surveys/${surveyDraft.id}/questions`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({ questions: cleanedQuestions }),
        });
      }
      const refreshed = await apiRequest("/api/admin/surveys", { headers: authHeaders });
      dispatch(setSurveys(refreshed.surveys || []));
      if (savedId) {
        navigate(`/dashboard/surveys/${savedId}`);
      }
      setMode("view");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!surveyDraft.id) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${surveyDraft.id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/surveys", { headers: authHeaders });
      dispatch(setSurveys(refreshed.surveys || []));
      navigate("/dashboard/surveys");
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
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {isNew ? "New Survey" : surveyDraft.title || "Survey"}
            </Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Surveys / Profile</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/surveys")}>
              Back to list
            </Button>
            {mode === "view" ? (
              <Button variant="contained" sx={classes.button} onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <Button variant="contained" sx={classes.button} onClick={handleSave}>
                Save
              </Button>
            )}
            {!isNew && (
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Overview</Typography>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>Summary</Typography>
          <Typography sx={{ color: "var(--color-text)", fontSize: "1.25rem", fontWeight: 700 }}>
            {surveyDraft.title || "Untitled Survey"}
          </Typography>
          <Typography sx={{ color: "var(--color-muted)" }}>
            {surveyDraft.description || "No description added yet."}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Questions</Typography>
          {surveyDraft.questions.map((question, index) => (
            <Box key={`question-${index}`} sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <TextField
                label={`Question ${index + 1}`}
                value={question.text}
                onChange={(event) => updateQuestionText(index, event.target.value)}
                sx={{ ...classes.input, flex: 1 }}
                disabled={mode === "view"}
              />
              {mode === "edit" && surveyDraft.questions.length > 1 && (
                <Button
                  variant="outlined"
                  sx={{ color: "var(--color-text)" }}
                  onClick={() => removeQuestion(index)}
                >
                  Remove
                </Button>
              )}
            </Box>
          ))}
          {mode === "edit" && (
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={addQuestion}>
              Add Question
            </Button>
          )}
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "720px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Settings</Typography>
          <TextField
            label="Survey title"
            value={surveyDraft.title}
            onChange={(event) => setSurveyDraft((prev) => ({ ...prev, title: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <TextField
            label="Description"
            value={surveyDraft.description}
            onChange={(event) => setSurveyDraft((prev) => ({ ...prev, description: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
            disabled={mode === "view"}
          />
          <TextField
            label="Comment prompt"
            value={surveyDraft.commentPrompt}
            onChange={(event) => setSurveyDraft((prev) => ({ ...prev, commentPrompt: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <TextField
            select
            label="Status"
            value={surveyDraft.isActive ? "active" : "inactive"}
            onChange={(event) =>
              setSurveyDraft((prev) => ({ ...prev, isActive: event.target.value === "active" }))
            }
            sx={classes.input}
            disabled={mode === "view"}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>
      </Box>
    </Box>
  );
}
