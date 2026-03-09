import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import SurveysSection from "../../../Components/Dashboard/SurveysSection";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setSurveys } from "../../../store/dashboardSlice";

const emptyQuestion = { text: "" };

export default function SurveysPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const surveys = useSelector((state) => state.dashboard.surveys);
  const [dataError, setDataError] = useState("");
  const [surveySearch, setSurveySearch] = useState("");
  const [surveyCreateOpen, setSurveyCreateOpen] = useState(false);
  const [surveyEditOpen, setSurveyEditOpen] = useState(false);
  const [newSurveyTitle, setNewSurveyTitle] = useState("");
  const [newSurveyDescription, setNewSurveyDescription] = useState("");
  const [newSurveyCommentPrompt, setNewSurveyCommentPrompt] = useState("");
  const [newSurveyQuestions, setNewSurveyQuestions] = useState([emptyQuestion]);
  const [editingSurveyId, setEditingSurveyId] = useState(null);
  const [editSurveyTitle, setEditSurveyTitle] = useState("");
  const [editSurveyDescription, setEditSurveyDescription] = useState("");
  const [editSurveyCommentPrompt, setEditSurveyCommentPrompt] = useState("");
  const [editSurveyActive, setEditSurveyActive] = useState(true);
  const [editSurveyQuestions, setEditSurveyQuestions] = useState([emptyQuestion]);

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("new") === "1") {
      openCreateSurvey();
    }
  }, [location.search]);

  const openCreateSurvey = () => {
    setNewSurveyTitle("");
    setNewSurveyDescription("");
    setNewSurveyCommentPrompt("");
    setNewSurveyQuestions([emptyQuestion]);
    setSurveyCreateOpen(true);
  };

  const handleCreateSurvey = async () => {
    if (!newSurveyTitle.trim()) {
      setDataError("Survey title is required.");
      return;
    }
    const cleanedQuestions = newSurveyQuestions.filter((q) => q.text.trim());
    if (cleanedQuestions.length === 0) {
      setDataError("At least one question is required.");
      return;
    }

    try {
      setDataError("");
      await apiRequest("/api/admin/surveys", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          title: newSurveyTitle.trim(),
          description: newSurveyDescription.trim(),
          commentPrompt: newSurveyCommentPrompt.trim(),
          questions: cleanedQuestions,
        }),
      });
      const result = await apiRequest("/api/admin/surveys", { headers: authHeaders });
      dispatch(setSurveys(result.surveys || []));
      setSurveyCreateOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleStartEditSurvey = (survey) => {
    setEditingSurveyId(survey.id);
    setEditSurveyTitle(survey.title || "");
    setEditSurveyDescription(survey.description || "");
    setEditSurveyCommentPrompt(survey.commentPrompt || "");
    setEditSurveyActive(Boolean(survey.isActive));
    setEditSurveyQuestions(
      survey.questions?.length ? survey.questions.map((q) => ({ text: q.text })) : [emptyQuestion]
    );
    setSurveyEditOpen(true);
  };

  const handleSaveSurvey = async () => {
    if (!editingSurveyId) return;
    if (!editSurveyTitle.trim()) {
      setDataError("Survey title is required.");
      return;
    }
    const cleanedQuestions = editSurveyQuestions.filter((q) => q.text.trim());
    if (cleanedQuestions.length === 0) {
      setDataError("At least one question is required.");
      return;
    }

    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${editingSurveyId}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          title: editSurveyTitle.trim(),
          description: editSurveyDescription.trim(),
          commentPrompt: editSurveyCommentPrompt.trim(),
          isActive: editSurveyActive,
        }),
      });
      await apiRequest(`/api/admin/surveys/${editingSurveyId}/questions`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ questions: cleanedQuestions }),
      });
      const result = await apiRequest("/api/admin/surveys", { headers: authHeaders });
      dispatch(setSurveys(result.surveys || []));
      setSurveyEditOpen(false);
    } catch (error) {
      setDataError(error.message);
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

  const handleToggleSurveyActive = async (survey) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/surveys/${survey.id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({ isActive: !survey.isActive }),
      });
      const result = await apiRequest("/api/admin/surveys", { headers: authHeaders });
      dispatch(setSurveys(result.surveys || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleEditQuestionChange = (index, value, setter) => {
    setter((prev) => prev.map((q, i) => (i === index ? { ...q, text: value } : q)));
  };

  const handleAddQuestion = (setter) => {
    setter((prev) => [...prev, { text: "" }]);
  };

  const handleRemoveQuestion = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <SurveysSection
        classes={classes}
        surveySearch={surveySearch}
        onSurveySearchChange={setSurveySearch}
        filteredSurveys={filteredSurveys}
        onCreateSurvey={openCreateSurvey}
        onEditSurvey={handleStartEditSurvey}
        onToggleSurveyActive={handleToggleSurveyActive}
        onDeleteSurvey={handleDeleteSurvey}
      />

      <Dialog
        open={surveyCreateOpen}
        onClose={() => setSurveyCreateOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Create Survey
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            label="Survey title"
            value={newSurveyTitle}
            onChange={(event) => setNewSurveyTitle(event.target.value)}
            sx={classes.input}
          />
          <TextField
            label="Description"
            value={newSurveyDescription}
            onChange={(event) => setNewSurveyDescription(event.target.value)}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <TextField
            label="Comment prompt"
            value={newSurveyCommentPrompt}
            onChange={(event) => setNewSurveyCommentPrompt(event.target.value)}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>Questions</Typography>
          {newSurveyQuestions.map((question, index) => (
            <Box key={`new-question-${index}`} sx={{ display: "grid", gap: "8px" }}>
              <TextField
                label={`Question ${index + 1}`}
                value={question.text}
                onChange={(event) => handleEditQuestionChange(index, event.target.value, setNewSurveyQuestions)}
                sx={classes.input}
              />
              {newSurveyQuestions.length > 1 && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "var(--color-text)" }}
                  onClick={() => handleRemoveQuestion(index, setNewSurveyQuestions)}
                >
                  Remove question
                </Button>
              )}
            </Box>
          ))}
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => handleAddQuestion(setNewSurveyQuestions)}>
            Add question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setSurveyCreateOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleCreateSurvey}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={surveyEditOpen}
        onClose={() => setSurveyEditOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Edit Survey
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <TextField
            label="Survey title"
            value={editSurveyTitle}
            onChange={(event) => setEditSurveyTitle(event.target.value)}
            sx={classes.input}
          />
          <TextField
            label="Description"
            value={editSurveyDescription}
            onChange={(event) => setEditSurveyDescription(event.target.value)}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <TextField
            label="Comment prompt"
            value={editSurveyCommentPrompt}
            onChange={(event) => setEditSurveyCommentPrompt(event.target.value)}
            sx={classes.input}
            multiline
            minRows={2}
          />
          <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>Questions</Typography>
          {editSurveyQuestions.map((question, index) => (
            <Box key={`edit-question-${index}`} sx={{ display: "grid", gap: "8px" }}>
              <TextField
                label={`Question ${index + 1}`}
                value={question.text}
                onChange={(event) => handleEditQuestionChange(index, event.target.value, setEditSurveyQuestions)}
                sx={classes.input}
              />
              {editSurveyQuestions.length > 1 && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: "var(--color-text)" }}
                  onClick={() => handleRemoveQuestion(index, setEditSurveyQuestions)}
                >
                  Remove question
                </Button>
              )}
            </Box>
          ))}
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => handleAddQuestion(setEditSurveyQuestions)}>
            Add question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setSurveyEditOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveSurvey}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
