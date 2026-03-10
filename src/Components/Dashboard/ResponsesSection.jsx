import React from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export default function ResponsesSection({
  classes,
  selectedSurveyId,
  onSelectedSurveyChange,
  selectedSchoolId,
  onSelectedSchoolChange,
  inviteSurveyOptions,
  inviteSchoolOptions,
  responses,
  onViewResponse,
  formatDate,
}) {
  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Responses</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Responses</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              select
              label="Survey"
              value={selectedSurveyId}
              onChange={(event) => onSelectedSurveyChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            >
              {inviteSurveyOptions.map((survey) => (
                <MenuItem key={survey.id} value={survey.id}>
                  {survey.title}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Organization"
              value={selectedSchoolId}
              onChange={(event) => onSelectedSchoolChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            >
              {inviteSchoolOptions.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        {!selectedSurveyId ? (
          <Typography sx={{ color: "var(--color-muted)" }}>
            Select a survey above to view question-by-question responses.
          </Typography>
        ) : responses.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No responses yet.</Typography>
        ) : (
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Date</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Comment</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id} hover>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {response.team_name || response.organization_name || "—"}
                      {response.team_name && response.organization_name && (
                        <Typography sx={{ color: "var(--color-muted)", fontSize: "0.78rem" }}>
                          {response.organization_name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {response.survey_title || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {formatDate(response.created_at)}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {response.comment
                        ? response.comment.length > 60
                          ? `${response.comment.slice(0, 60)}...`
                          : response.comment
                        : "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onViewResponse(response)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
