import React from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function OverviewSection({
  classes,
  stats,
  alerts,
  onNewOrganization,
  onAddTeam,
  onCreateSurvey,
  onGenerateInvites,
  onAddContact,
  inviteDisabled,
  contactDisabled,
  recentInvites,
  recentResponses,
  formatDate,
}) {
  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Overview</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Overview</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              sx={{ color: "var(--color-text)", borderColor: "var(--color-border)" }}
              onClick={onNewOrganization}
            >
              New Organization
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ color: "var(--color-text)", borderColor: "var(--color-border)" }}
              onClick={onAddTeam}
            >
              Add Team
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={classes.button}
              onClick={onCreateSurvey}
            >
              Create Survey
            </Button>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box
          sx={{
            display: "grid",
            gap: "12px",
            gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
          }}
        >
          {stats.map((stat) => (
            <Box key={stat.label} sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.78rem" }}>
                {stat.label}
              </Typography>
              <Typography sx={{ color: "var(--color-text)", fontSize: "1.35rem", fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: "16px", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" } }}>
        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Alerts & Recommendations</Typography>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Actionable items to keep operations on track.
          </Typography>
          <Box sx={{ display: "grid", gap: "8px" }}>
            {alerts.length === 0 ? (
              <Alert severity="success">All systems look healthy right now.</Alert>
            ) : (
              alerts.map((alert, index) => (
                <Alert key={`${alert.title}-${index}`} severity="warning">
                  <strong>{alert.title}</strong> — {alert.body}
                </Alert>
              ))
            )}
          </Box>
        </Box>

        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Quick Actions</Typography>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Jump into the next step without hunting through menus.
          </Typography>
          <Box sx={{ display: "grid", gap: "10px" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={onNewOrganization}>
              Add organization
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "var(--color-text)" }}
              onClick={onGenerateInvites}
              disabled={inviteDisabled}
            >
              Generate invite links
            </Button>
            <Button
              variant="outlined"
              sx={{ color: "var(--color-text)" }}
              onClick={onAddContact}
              disabled={contactDisabled}
            >
              Add contact
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gap: "16px", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Recent Invites</Typography>
          {recentInvites.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>No invite activity yet.</Typography>
          ) : (
            <DataGrid
              rows={recentInvites}
              columns={[
                {
                  field: "team_name",
                  headerName: "Team",
                  flex: 1,
                  minWidth: 220,
                  valueGetter: (_value, row) => row?.team_name || row?.organization_name || "—",
                },
                {
                  field: "survey_title",
                  headerName: "Survey",
                  flex: 1,
                  minWidth: 200,
                  valueGetter: (_value, row) => row?.survey_title || "—",
                },
                {
                  field: "status",
                  headerName: "Status",
                  width: 140,
                  valueGetter: (_value, row) => (row?.used_at ? "Used" : "Unused"),
                },
              ]}
              autoHeight
              density="compact"
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
              sx={classes.dataGrid}
            />
          )}
        </Box>

        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Recent Responses</Typography>
          {recentResponses.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>No responses yet.</Typography>
          ) : (
            <DataGrid
              rows={recentResponses}
              columns={[
                {
                  field: "team_name",
                  headerName: "Team",
                  flex: 1,
                  minWidth: 220,
                  valueGetter: (_value, row) => row?.team_name || row?.organization_name || "—",
                },
                {
                  field: "survey_title",
                  headerName: "Survey",
                  flex: 1,
                  minWidth: 200,
                  valueGetter: (_value, row) => row?.survey_title || "—",
                },
                {
                  field: "created_at",
                  headerName: "Date",
                  width: 160,
                  valueGetter: (_value, row) => formatDate(row?.created_at),
                },
              ]}
              autoHeight
              density="compact"
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
              sx={classes.dataGrid}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
