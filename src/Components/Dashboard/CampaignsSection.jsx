import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import OrganizationTeamMultiSelect from "./OrganizationTeamMultiSelect";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function CampaignsSection({
  classes,
  selectedSurveyId,
  onSelectedSurveyChange,
  selectedTeamIds = [],
  teamsByOrganization = {},
  onSelectedTeamIdsChange = () => {},
  inviteSurveyOptions,
  organizationOptions,
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
            <OrganizationTeamMultiSelect
              classes={classes}
              label="Teams"
              minWidth="260px"
              organizationOptions={organizationOptions}
              teamsByOrganization={teamsByOrganization}
              selectedTeamIds={selectedTeamIds}
              onSelectedTeamIdsChange={onSelectedTeamIdsChange}
            />
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
            <DataGrid
                rows={latestInvites}
                columns={[
                  {
                    field: "selected",
                    headerName: "",
                    width: 60,
                    sortable: false,
                    filterable: false,
                    renderCell: (params) => (
                      <Checkbox
                        checked={selectedInviteIds.includes(params.row.id)}
                        onChange={() => onToggleInvite(params.row.id)}
                        sx={{
                          color: "var(--color-muted)",
                          "&.Mui-checked": { color: "var(--color-accent)" },
                        }}
                      />
                    ),
                  },
                  {
                    field: "link",
                    headerName: "Invite Link",
                    flex: 1,
                    minWidth: 240,
                    valueGetter: (_value, row) => getInviteText(row),
                    renderCell: (params) => (
                      <Typography sx={{ color: "var(--color-text)", fontFamily: "monospace" }}>
                        {getInviteText(params.row)}
                      </Typography>
                    ),
                  },
                  {
                    field: "actions",
                    headerName: "Action",
                    width: 120,
                    sortable: false,
                    filterable: false,
                    renderCell: (params) => {
                      const inviteText = getInviteText(params.row);
                      return (
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ color: "var(--color-text)" }}
                          onClick={() => onCopyInvite(inviteText)}
                        >
                          Copy
                        </Button>
                      );
                    },
                  },
                ]}
                autoHeight
                density="compact"
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { page: 0, pageSize: 5 } },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
                sx={classes.dataGrid}
              />
          </Box>
        )}
      </Box>

      <Box sx={classes.section}>
        <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Invite Status</Typography>
        {invites.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No invite links yet.</Typography>
        ) : (
          <DataGrid
            rows={invites}
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
                width: 180,
                valueGetter: (_value, row) =>
                  row?.used_at ? `Used ${formatDate(row.used_at)}` : "Unused",
              },
              {
                field: "actions",
                headerName: "Actions",
                minWidth: 220,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    {!params.row.used_at && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: "var(--color-text)" }}
                        onClick={() => onRegenerateInvite(params.row.id)}
                      >
                        Resend
                      </Button>
                    )}
                    {params.row.used_at && (
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: "var(--color-text)" }}
                        onClick={() => onReopenInvite(params.row.id)}
                      >
                        Reopen
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onDeleteInvite(params.row.id)}
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
        )}
      </Box>
    </Box>
  );
}
