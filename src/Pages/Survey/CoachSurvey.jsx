import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ratingOptions, surveyQuestions } from "./surveyConfig";
import { apiRequest } from "./surveyApi";

const classes = {
  page: {
    minHeight: "100vh",
    padding: { xs: "32px 0", md: "48px 0" },
    background:
      "radial-gradient(circle at top, rgba(215, 38, 56, 0.22), transparent 55%), var(--color-bg)",
  },
  card: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "28px",
    padding: { xs: "24px", md: "36px" },
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
  },
  headerEyebrow: {
    fontFamily: "var(--font-display)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    fontSize: "0.8rem",
    color: "var(--color-muted)",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: { xs: "2rem", md: "2.6rem" },
    textTransform: "uppercase",
  },
  questionCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "20px",
    padding: "20px",
    display: "grid",
    gap: "12px",
  },
  radioLabel: {
    color: "var(--color-text)",
    "& .MuiFormControlLabel-label": {
      fontSize: "0.95rem",
    },
  },
  radio: {
    color: "var(--color-muted)",
    "&.Mui-checked": {
      color: "var(--color-accent)",
    },
  },
  commentField: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface-3)",
      color: "var(--color-text)",
      borderRadius: "16px",
      "& fieldset": {
        borderColor: "var(--color-border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--color-accent)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-accent)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--color-muted)",
    },
  },
  submitButton: {
    alignSelf: "flex-start",
    backgroundColor: "var(--color-accent)",
    borderRadius: "999px",
    padding: "12px 32px",
    boxShadow: "0 16px 30px rgba(215, 38, 56, 0.4)",
    "&:hover": {
      backgroundColor: "var(--color-accent-2)",
    },
  },
};

const buildInitialAnswers = () => {
  return surveyQuestions.reduce((acc, question) => {
    acc[question.key] = "";
    return acc;
  }, {});
};

export default function CoachSurvey() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ error: "", used: false, schoolName: "" });
  const [answers, setAnswers] = useState(buildInitialAnswers);
  const [comment, setComment] = useState("");
  const [submitState, setSubmitState] = useState({ submitting: false, error: "", success: false });

  const missingAnswers = useMemo(() => {
    return surveyQuestions.filter((question) => !answers[question.key]);
  }, [answers]);

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const result = await apiRequest(`/api/survey/${token}`);
        if (!active) return;
        setStatus({ error: "", used: result.used, schoolName: result.schoolName || "" });
      } catch (error) {
        if (!active) return;
        setStatus({ error: error.message, used: false, schoolName: "" });
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStatus();
    return () => {
      active = false;
    };
  }, [token]);

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (missingAnswers.length > 0) {
      setSubmitState({ submitting: false, error: "Please answer every question.", success: false });
      return;
    }

    setSubmitState({ submitting: true, error: "", success: false });

    try {
      await apiRequest(`/api/survey/${token}`, {
        method: "POST",
        body: JSON.stringify({
          ...answers,
          comment,
        }),
      });

      setSubmitState({ submitting: false, error: "", success: true });
    } catch (error) {
      setSubmitState({ submitting: false, error: error.message, success: false });
    }
  };

  return (
    <Box sx={classes.page}>
      <Container maxWidth="md">
        <Paper sx={classes.card}>
          <Typography sx={classes.headerEyebrow}>High School Coaching Survey</Typography>
          <Typography sx={classes.title} gutterBottom>
            Dauntless Athletics
          </Typography>
          <Typography sx={{ color: "var(--color-muted)", marginBottom: "24px" }}>
            {status.schoolName
              ? `This confidential survey is for ${status.schoolName}. We appreciate your honest feedback.`
              : "This confidential survey helps us improve our coaching experience."}
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
              <CircularProgress sx={{ color: "var(--color-accent)" }} />
            </Box>
          )}

          {!loading && status.error && <Alert severity="error">{status.error}</Alert>}

          {!loading && status.used && (
            <Alert severity="info">This survey link has already been used. Thank you!</Alert>
          )}

          {!loading && !status.error && !status.used && !submitState.success && (
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: "20px" }}>
              {surveyQuestions.map((question, index) => (
                <Box key={question.key} sx={classes.questionCard}>
                  <Typography sx={{ fontWeight: 600 }}>
                    {index + 1}. {question.text}
                  </Typography>
                  <RadioGroup
                    row
                    value={answers[question.key]}
                    onChange={(event) => handleAnswerChange(question.key, Number(event.target.value))}
                  >
                    {ratingOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio sx={classes.radio} />}
                        label={option.label}
                        sx={classes.radioLabel}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}

              <Box sx={classes.questionCard}>
                <Typography sx={{ fontWeight: 600 }}>
                  6. Is there anything we can do better with our coaching approach? Anything you would like
                  changed moving forward?
                </Typography>
                <TextField
                  multiline
                  minRows={4}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  label="Optional comments"
                  sx={classes.commentField}
                />
              </Box>

              {submitState.error && <Alert severity="error">{submitState.error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                sx={classes.submitButton}
                disabled={submitState.submitting}
              >
                {submitState.submitting ? "Submitting..." : "Submit Survey"}
              </Button>
            </Box>
          )}

          {submitState.success && (
            <Alert severity="success">
              Thanks for sharing your feedback. Your response has been recorded.
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
