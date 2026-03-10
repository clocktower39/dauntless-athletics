import React from "react";
import {
  Alert,
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
  Typography,
} from "@mui/material";

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
            <TableContainer component={Paper} sx={classes.tablePaper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                    <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                    <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentInvites.map((invite) => (
                    <TableRow key={invite.id} hover>
                      <TableCell sx={{ color: "var(--color-text)" }}>
                        {invite.team_name || invite.organization_name || "—"}
                        {invite.team_name && invite.organization_name && (
                          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.78rem" }}>
                            {invite.organization_name}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ color: "var(--color-text)" }}>
                        {invite.survey_title || "—"}
                      </TableCell>
                      <TableCell sx={{ color: invite.used_at ? "var(--color-accent)" : "var(--color-muted)" }}>
                        {invite.used_at ? "Used" : "Unused"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Recent Responses</Typography>
          {recentResponses.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>No responses yet.</Typography>
          ) : (
            <TableContainer component={Paper} sx={classes.tablePaper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                    <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                    <TableCell sx={classes.tableHeadCell}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentResponses.map((response) => (
                    <TableRow key={response.id} hover>
                      <TableCell sx={{ color: "var(--color-text)" }}>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </Box>
  );
}
