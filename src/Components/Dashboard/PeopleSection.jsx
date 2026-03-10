import React from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

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
              { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
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
              },
              {
                field: "team_name",
                headerName: "Team",
                flex: 1,
                minWidth: 180,
                valueGetter: (value, row) => resolveRow(value, row)?.team_name || "Unassigned",
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
                minWidth: 160,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onEditContact(params.row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onDeleteContact(params.row.id)}
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
