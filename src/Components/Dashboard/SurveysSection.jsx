import React from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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
          <DataGrid
            rows={filteredSurveys}
            columns={[
              { field: "title", headerName: "Survey", flex: 1, minWidth: 220 },
              {
                field: "questionsCount",
                headerName: "Questions",
                width: 130,
                valueGetter: (_value, row) => row?.questions?.length || 0,
              },
              {
                field: "isActive",
                headerName: "Status",
                width: 140,
                valueGetter: (_value, row) => (row?.isActive ? "Active" : "Inactive"),
              },
              {
                field: "actions",
                headerName: "Actions",
                minWidth: 240,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onEditSurvey(params.row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onToggleSurveyActive(params.row)}
                    >
                      {params.row.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onDeleteSurvey(params.row.id)}
                    >
                      Delete
                    </Button>
                  </Box>
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
        ) : (
          <Typography sx={{ color: "var(--color-muted)" }}>
            No surveys yet. Create one to get started.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
