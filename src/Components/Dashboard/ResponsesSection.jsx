import React from "react";
import {
  Box,
  Divider,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import RowActionsMenu from "./RowActionsMenu";

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
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };
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
          <DataGrid
            rows={responses}
            columns={[
              {
                field: "team_name",
                headerName: "Team",
                flex: 1,
                minWidth: 220,
                valueGetter: (_value, row) => row?.team_name || row?.organization_name || "—",
                renderCell: (params) =>
                  params.row.team_id ? (
                    <Link component={RouterLink} to={`/dashboard/teams/${params.row.team_id}`} sx={linkSx}>
                      {params.value}
                    </Link>
                  ) : params.row.organization_id ? (
                    <Link
                      component={RouterLink}
                      to={`/dashboard/organizations/${params.row.organization_id}`}
                      sx={linkSx}
                    >
                      {params.value}
                    </Link>
                  ) : (
                    params.value
                  ),
              },
              {
                field: "survey_title",
                headerName: "Survey",
                flex: 1,
                minWidth: 200,
                valueGetter: (_value, row) => row?.survey_title || "—",
                renderCell: (params) =>
                  params.row.survey_id ? (
                    <Link component={RouterLink} to={`/dashboard/surveys/${params.row.survey_id}`} sx={linkSx}>
                      {params.value}
                    </Link>
                  ) : (
                    params.value
                  ),
              },
              {
                field: "created_at",
                headerName: "Date",
                width: 160,
                valueGetter: (_value, row) => formatDate(row?.created_at),
              },
              {
                field: "comment",
                headerName: "Comment",
                flex: 1,
                minWidth: 260,
                valueGetter: (_value, row) =>
                  row?.comment
                    ? row.comment.length > 60
                      ? `${row.comment.slice(0, 60)}...`
                      : row.comment
                    : "—",
              },
              {
                field: "actions",
                headerName: "Actions",
                minWidth: 120,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <RowActionsMenu
                    actions={[
                      { label: "View", onClick: () => onViewResponse(params.row) },
                    ]}
                  />
                ),
              },
            ]}
            autoHeight
            density="compact"
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
            sx={classes.dataGrid}
          />
        )}
      </Box>
    </Box>
  );
}
