import React from "react";
import {
  Box,
  Button,
  Divider,
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

export default function SurveysSection({
  classes,
  surveySearch,
  onSurveySearchChange,
  filteredSurveys,
  onCreateSurvey,
  onEditSurvey,
  onToggleSurveyActive,
  onDeleteSurvey,
}) {
  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Survey Templates</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Surveys</Typography>
          </Box>
          <Button variant="contained" sx={classes.button} onClick={onCreateSurvey}>
            Create Survey
          </Button>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <TextField
            label="Search surveys"
            value={surveySearch}
            onChange={(event) => onSurveySearchChange(event.target.value)}
            sx={{ ...classes.input, minWidth: "220px" }}
          />
        </Box>
        {filteredSurveys.length > 0 ? (
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Questions</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSurveys.map((survey) => (
                  <TableRow key={survey.id} hover>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {survey.title}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {survey.questions?.length || 0}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {survey.isActive ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditSurvey(survey)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onToggleSurveyActive(survey)}>
                          {survey.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteSurvey(survey.id)}>
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ color: "var(--color-muted)" }}>
            No surveys yet. Create one to get started.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
