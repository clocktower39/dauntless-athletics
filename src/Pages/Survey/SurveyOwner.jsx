import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { apiRequest, authHeader } from "./surveyApi";
import { ratingOptions, surveyQuestions } from "./surveyConfig";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

const TOKEN_KEY = "dauntlessSurveyOwnerToken";

const classes = {
  page: {
    minHeight: "100vh",
    padding: { xs: "32px 0", md: "48px 0" },
    background:
      "radial-gradient(circle at 80% 20%, rgba(215, 38, 56, 0.18), transparent 55%), var(--color-bg)",
    "--color-text": "#ffffff",
    "--color-muted": "#d5deea",
    "--color-border": "rgba(255, 255, 255, 0.18)",
  },
  card: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "24px",
    padding: { xs: "20px", md: "28px" },
    boxShadow: "0 28px 55px rgba(0,0,0,0.45)",
    display: "grid",
    gap: "16px",
  },
  section: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: "18px",
    display: "grid",
    gap: "12px",
  },
  statCard: {
    backgroundColor: "var(--color-surface-3)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "14px",
    display: "grid",
    gap: "6px",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface-3)",
      color: "var(--color-text)",
      borderRadius: "12px",
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
  button: {
    backgroundColor: "var(--color-accent)",
    borderRadius: "999px",
    padding: "10px 24px",
    "&:hover": {
      backgroundColor: "var(--color-accent-2)",
    },
  },
};

const ratingLabels = ratingOptions.map((option) => option.value).sort((a, b) => b - a);

export default function SurveyOwner() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [login, setLogin] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [summary, setSummary] = useState(null);
  const [dataError, setDataError] = useState("");

  const authHeaders = useMemo(() => authHeader(token), [token]);

  useEffect(() => {
    if (!token) return;

    const fetchSummary = async () => {
      try {
        setDataError("");
        const result = await apiRequest("/api/owner/summary", { headers: authHeaders });
        setSummary(result);
      } catch (error) {
        setDataError(error.message);
      }
    };

    fetchSummary();
  }, [token, authHeaders]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setLoginError("");
    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      if (result.role !== "owner") {
        throw new Error("This account does not have owner access.");
      }
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setLogin({ username: "", password: "" });
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  };

  const renderDistribution = (distribution) => {
    return (
      <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {ratingLabels.map((rating) => (
          <Typography key={rating} sx={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
            {rating}: {distribution?.[rating] || 0}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={classes.page}>
      <Container maxWidth="lg" sx={{ display: "grid", gap: "20px" }}>
        <Paper sx={classes.card}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              src={DauntlessAthleticsLogoDesktopCircleImg}
              alt="Dauntless Athletics Logo"
              sx={{ width: 72, height: 72 }}
            />
          </Box>
          <Typography
            sx={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--color-text)" }}
          >
            Survey Responses
          </Typography>
          <Typography sx={{ color: "var(--color-muted)" }}>
            Anonymous, aggregated feedback for internal review.
          </Typography>

          {!token && (
            <Box component="form" onSubmit={handleLogin} sx={classes.section}>
              <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Responses Login</Typography>
              <TextField
                label="Username"
                value={login.username}
                onChange={(event) => setLogin((prev) => ({ ...prev, username: event.target.value }))}
                sx={classes.input}
              />
              <TextField
                label="Password"
                type="password"
                value={login.password}
                onChange={(event) => setLogin((prev) => ({ ...prev, password: event.target.value }))}
                sx={classes.input}
              />
              {loginError && <Alert severity="error">{loginError}</Alert>}
              <Button type="submit" variant="contained" sx={classes.button} disabled={authLoading}>
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          )}

          {token && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Access Granted</Typography>
                <Button variant="outlined" onClick={handleLogout} sx={{ color: "var(--color-text)" }}>
                  Log out
                </Button>
              </Box>
              {dataError && <Alert severity="error">{dataError}</Alert>}

              {summary && (
                <>
                  <Box sx={classes.section}>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                      Overall Responses
                    </Typography>
                    <Typography sx={{ fontSize: "1.4rem", color: "var(--color-text)" }}>
                      {summary.totalResponses}
                    </Typography>
                    <Typography sx={{ color: "var(--color-muted)" }}>
                      Response rate: {summary.responseRate ?? 0}% ({summary.usedInvites ?? 0}/
                      {summary.totalInvites ?? 0})
                    </Typography>
                  </Box>

                  <Divider />

                  <Box sx={classes.section}>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
                      Question Averages
                    </Typography>
                    <Box sx={{ display: "grid", gap: "16px" }}>
                      {surveyQuestions.map((question) => (
                        <Box key={question.key} sx={classes.statCard}>
                          <Typography sx={{ color: "var(--color-text)" }}>{question.text}</Typography>
                          <Typography sx={{ color: "var(--color-accent)", fontWeight: 600 }}>
                            Average: {summary.averages?.[question.key] ?? "n/a"}
                          </Typography>
                          {renderDistribution(summary.distribution?.[question.key])}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider />

                  <Box sx={classes.section}>
                    <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Comments</Typography>
                    {summary.comments?.length ? (
                      <Box sx={{ display: "grid", gap: "12px" }}>
                        {summary.comments.map((comment, index) => (
                          <Paper
                            key={`${comment.created_at}-${index}`}
                            sx={{ backgroundColor: "var(--color-surface-3)", padding: "14px", borderRadius: "12px" }}
                          >
                            <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                              {new Date(comment.created_at).toLocaleString()}
                            </Typography>
                            <Typography sx={{ color: "var(--color-text)" }}>{comment.comment}</Typography>
                          </Paper>
                        ))}
                      </Box>
                    ) : (
                      <Typography sx={{ color: "var(--color-muted)" }}>No comments yet.</Typography>
                    )}
                  </Box>
                </>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
