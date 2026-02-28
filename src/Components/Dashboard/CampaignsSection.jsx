import React from "react";
import {
  Box,
  Button,
  Checkbox,
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

export default function CampaignsSection({
  classes,
  selectedSurveyId,
  onSelectedSurveyChange,
  selectedSchoolId,
  onSelectedSchoolChange,
  inviteSurveyOptions,
  inviteSchoolOptions,
  onGenerateLinks,
  generateDisabled,
  latestInvites,
  allInvitesSelected,
  selectedInviteIds,
  onToggleAllInvites,
  onToggleInvite,
  onCopySelected,
  getInviteText,
  onCopyInvite,
  invites,
  formatDate,
  onRegenerateInvite,
  onReopenInvite,
  onDeleteInvite,
}) {
  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Campaigns</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Campaigns</Typography>
          </Box>
          <Button variant="contained" sx={classes.button} onClick={onGenerateLinks} disabled={generateDisabled}>
            Generate Links
          </Button>
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

        {latestInvites.length > 0 && (
          <Box sx={{ display: "grid", gap: "10px" }}>
            <Box sx={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <Checkbox
                checked={allInvitesSelected}
                onChange={onToggleAllInvites}
                sx={{
                  color: "var(--color-muted)",
                  "&.Mui-checked": { color: "var(--color-accent)" },
                }}
              />
              <Typography sx={{ color: "var(--color-text)" }}>Select all</Typography>
              <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={onCopySelected}>
                Copy selected
              </Button>
            </Box>
            <TableContainer component={Paper} sx={classes.tablePaper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={classes.tableHeadCell} />
                    <TableCell sx={classes.tableHeadCell}>Invite Link</TableCell>
                    <TableCell sx={classes.tableHeadCell} align="right">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latestInvites.map((invite) => {
                    const inviteText = getInviteText(invite);
                    return (
                      <TableRow key={invite.id} hover>
                        <TableCell>
                          <Checkbox
                            checked={selectedInviteIds.includes(invite.id)}
                            onChange={() => onToggleInvite(invite.id)}
                            sx={{
                              color: "var(--color-muted)",
                              "&.Mui-checked": { color: "var(--color-accent)" },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)", fontFamily: "monospace" }}>
                          {inviteText}
                        </TableCell>
                        <TableCell align="right">
                          <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onCopyInvite(inviteText)}>
                            Copy
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>

      <Box sx={classes.section}>
        <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Status</Typography>
        {invites.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No invite links yet.</Typography>
        ) : (
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>Organization</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Survey</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id} hover>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {invite.organization_name}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {invite.survey_title || "—"}
                    </TableCell>
                    <TableCell sx={{ color: invite.used_at ? "var(--color-accent)" : "var(--color-muted)" }}>
                      {invite.used_at ? `Used ${formatDate(invite.used_at)}` : "Unused"}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {!invite.used_at && (
                          <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onRegenerateInvite(invite.id)}>
                            Resend
                          </Button>
                        )}
                        {invite.used_at && (
                          <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onReopenInvite(invite.id)}>
                            Reopen
                          </Button>
                        )}
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteInvite(invite.id)}>
                          Delete
                        </Button>
                      </Box>
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
