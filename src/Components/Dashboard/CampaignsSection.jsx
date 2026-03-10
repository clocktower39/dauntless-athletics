import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import OrganizationTeamMultiSelect from "./OrganizationTeamMultiSelect";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import RowActionsMenu from "./RowActionsMenu";

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
  onViewInvite,
}) {
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };
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
                        <RowActionsMenu
                          actions={[
                            { label: "Copy Link", onClick: () => onCopyInvite(inviteText) },
                            { label: "View", onClick: () => onViewInvite(params.row) },
                          ]}
                        />
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
                field: "status",
                headerName: "Status",
                width: 180,
                valueGetter: (_value, row) =>
                  row?.used_at ? `Used ${formatDate(row.used_at)}` : "Unused",
              },
              {
                field: "actions",
                headerName: "Actions",
                minWidth: 160,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <RowActionsMenu
                    actions={[
                      { label: "View", onClick: () => onViewInvite(params.row) },
                      !params.row.used_at && { label: "Resend", onClick: () => onRegenerateInvite(params.row.id) },
                      params.row.used_at && { label: "Reopen", onClick: () => onReopenInvite(params.row.id) },
                      { label: "Delete", onClick: () => onDeleteInvite(params.row.id), color: "danger" },
                    ].filter(Boolean)}
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
