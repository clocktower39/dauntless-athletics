import React from "react";
import {
  Box,
  Button,
  Divider,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import RowActionsMenu from "./RowActionsMenu";

export default function PeopleSection({
  classes,
  peopleSearch,
  onPeopleSearchChange,
  organizations = [],
  contactOrgFilter = "all",
  onContactOrgFilterChange,
  contactTeamFilter = "all",
  onContactTeamFilterChange,
  contactTeamOptions = [],
  onAddContact,
  filteredContacts,
  onEditContact,
  onDeleteContact,
}) {
  const resolveRow = (value, row) => row ?? value?.row ?? value;
  const navigate = useNavigate();
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>People</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / People</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              label="Search"
              value={peopleSearch}
              onChange={(event) => onPeopleSearchChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            />
            <TextField
              select
              label="Organization"
              value={contactOrgFilter}
              onChange={(event) => onContactOrgFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            >
              <MenuItem value="all">All organizations</MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={String(org.id)}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Team"
              value={contactTeamFilter}
              onChange={(event) => onContactTeamFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            >
              <MenuItem value="all">All teams</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
              {contactTeamOptions.map((team) => (
                <MenuItem key={team.id} value={String(team.id)}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            <Box sx={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <Button variant="contained" sx={classes.button} onClick={onAddContact}>
                Add Contact
              </Button>
            </Box>
          </Box>
        </Box>
        {filteredContacts.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No contacts yet.</Typography>
        ) : (
          <DataGrid
            rows={filteredContacts}
            columns={[
              {
                field: "name",
                headerName: "Name",
                flex: 1,
                minWidth: 180,
                renderCell: (params) => (
                  <Link component={RouterLink} to={`/dashboard/people/${params.row.id}`} sx={linkSx}>
                    {params.value}
                  </Link>
                ),
              },
              {
                field: "role",
                headerName: "Role",
                flex: 0.7,
                minWidth: 120,
                valueGetter: (value, row) => resolveRow(value, row)?.role || "—",
              },
              {
                field: "audience",
                headerName: "Audience",
                flex: 0.7,
                minWidth: 120,
                valueGetter: (value, row) => resolveRow(value, row)?.audience || "—",
              },
              {
                field: "organization_name",
                headerName: "Organization",
                flex: 1,
                minWidth: 180,
                valueGetter: (value, row) => resolveRow(value, row)?.organization_name || "—",
                renderCell: (params) =>
                  params.row.organization_id ? (
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
                field: "team_name",
                headerName: "Team",
                flex: 1,
                minWidth: 180,
                valueGetter: (value, row) =>
                  resolveRow(value, row)?.team_names || resolveRow(value, row)?.team_name || "Unassigned",
                renderCell: (params) =>
                  params.row.team_id ? (
                    <Link component={RouterLink} to={`/dashboard/teams/${params.row.team_id}`} sx={linkSx}>
                      {params.value}
                    </Link>
                  ) : (
                    params.value
                  ),
              },
              {
                field: "email",
                headerName: "Email",
                flex: 1,
                minWidth: 200,
                valueGetter: (value, row) => resolveRow(value, row)?.email || "—",
              },
              {
                field: "phone",
                headerName: "Phone",
                flex: 0.8,
                minWidth: 160,
                valueGetter: (value, row) => resolveRow(value, row)?.phone || "—",
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
                      { label: "View", onClick: () => navigate(`/dashboard/people/${params.row.id}`) },
                      { label: "Edit", onClick: () => onEditContact(params.row) },
                      { label: "Delete", onClick: () => onDeleteContact(params.row.id), color: "danger" },
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
