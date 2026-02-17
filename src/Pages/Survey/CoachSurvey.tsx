import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { ratingOptions } from "./surveyConfig";
import { apiRequest } from "./surveyApi";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

type SurveyQuestion = {
  id: number;
  text: string;
  order: number;
};

type RatingOption = {
  value: number;
  label: string;
};

type AnswerValue = number | "";
type Answers = Record<string, AnswerValue>;

type SurveyStatus = {
  error: string;
  used: boolean;
  schoolName: string;
};

type SubmitState = {
  submitting: boolean;
  error: string;
  success: boolean;
};

type SurveyStatusResponse = {
  used: boolean;
  schoolName?: string;
  survey?: {
    id: number;
    title: string;
    description?: string;
    commentPrompt?: string;
    questions: SurveyQuestion[];
  };
};

const ratings = ratingOptions as RatingOption[];

const classes = {
  page: {
    minHeight: "100vh",
    padding: { xs: "32px 0", md: "48px 0" },
    background:
      "radial-gradient(circle at top, rgba(215, 38, 56, 0.22), transparent 55%), var(--color-bg)",
    "--color-text": "#ffffff",
    "--color-muted": "#d5deea",
    "--color-border": "rgba(255, 255, 255, 0.18)",
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
    color: "var(--color-text)",
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

const buildInitialAnswers = (items: SurveyQuestion[]): Answers => {
  return items.reduce<Answers>((acc, question) => {
    acc[String(question.id)] = "";
    return acc;
  }, {});
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";

export default function CoachSurvey() {
  const { token } = useParams<{ token: string }>();
  const tokenParam = token ?? "";
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SurveyStatus>({ error: "", used: false, schoolName: "" });
  const [survey, setSurvey] = useState<SurveyStatusResponse["survey"] | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [comment, setComment] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({
    submitting: false,
    error: "",
    success: false,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  const missingAnswers = useMemo(() => {
    return questions.filter((question) => answers[String(question.id)] === "");
  }, [answers, questions]);

  useEffect(() => {
    if (questions.length === 0) return;
    setAnswers(buildInitialAnswers(questions));
  }, [questions]);

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      if (!tokenParam) {
        setStatus({ error: "Invalid survey link.", used: false, schoolName: "" });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const result = (await apiRequest(`/api/survey/${tokenParam}`)) as SurveyStatusResponse;
        if (!active) return;
        setStatus({ error: "", used: result.used, schoolName: result.schoolName || "" });
        setSurvey(result.survey || null);
        setQuestions(result.survey?.questions || []);
      } catch (error) {
        if (!active) return;
        setStatus({ error: getErrorMessage(error), used: false, schoolName: "" });
        setSurvey(null);
        setQuestions([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchStatus();
    return () => {
      active = false;
    };
  }, [tokenParam]);

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (missingAnswers.length > 0) {
      setSubmitState({ submitting: false, error: "Please answer every question.", success: false });
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitState({ submitting: true, error: "", success: false });
    setConfirmOpen(false);

    try {
      await apiRequest(`/api/survey/${tokenParam}`, {
        method: "POST",
        body: JSON.stringify({
          answers,
          comment,
        }),
      });

      setSubmitState({ submitting: false, error: "", success: true });
    } catch (error) {
      setSubmitState({ submitting: false, error: getErrorMessage(error), success: false });
    }
  };

  return (
    <Box sx={classes.page}>
      <Container maxWidth="md">
        <Paper sx={classes.card}>
          <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <Avatar
              src={DauntlessAthleticsLogoDesktopCircleImg}
              alt="Dauntless Athletics Logo"
              sx={{ width: 72, height: 72 }}
            />
          </Box>
          <Typography sx={classes.headerEyebrow}>
            {survey?.title ? "Survey" : "High School Coaching Survey"}
          </Typography>
          <Typography sx={classes.title} gutterBottom>
            {survey?.title || "Dauntless Athletics"}
          </Typography>
          <Typography sx={{ color: "var(--color-muted)", marginBottom: "24px" }}>
            {survey?.description
              ? survey.description
              : status.schoolName
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
              {questions.map((question, index) => (
                <Box key={question.id} sx={classes.questionCard}>
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                    {index + 1}. {question.text}
                  </Typography>
                  <RadioGroup
                    row
                    value={answers[String(question.id)]}
                    onChange={(event) => handleAnswerChange(question.id, Number(event.target.value))}
                  >
                    {ratings.map((option) => (
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
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                  {questions.length + 1}.{" "}
                  {survey?.commentPrompt ||
                    "Is there anything we can do better with our coaching approach? Anything you would like changed moving forward?"}
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
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          Submit survey?
        </DialogTitle>
        <DialogContent sx={{ color: "var(--color-muted)" }}>
          Submissions are final and cannot be edited.
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => setConfirmOpen(false)}>
            Review
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--color-accent)" }}
            onClick={handleConfirmSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
