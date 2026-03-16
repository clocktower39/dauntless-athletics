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

export default function FamiliesSection({
  classes,
  familySearch,
  onFamilySearchChange,
  organizationFilter,
  onOrganizationFilterChange,
  statusFilter,
  onStatusFilterChange,
  organizations = [],
  families = [],
  onAddFamily,
  onEditFamily,
}) {
  const navigate = useNavigate();
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Families</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Families</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              label="Search"
              value={familySearch}
              onChange={(event) => onFamilySearchChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            />
            <TextField
              select
              label="Organization"
              value={organizationFilter}
              onChange={(event) => onOrganizationFilterChange(event.target.value)}
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
              label="Status"
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "180px" }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <Box sx={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              <Button variant="contained" sx={classes.button} onClick={onAddFamily}>
                Add Family
              </Button>
            </Box>
          </Box>
        </Box>
        {families.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No families yet.</Typography>
        ) : (
          <DataGrid
            rows={families}
            columns={[
              {
                field: "name",
                headerName: "Family",
                flex: 1,
                minWidth: 220,
                renderCell: (params) => (
                  <Link component={RouterLink} to={`/dashboard/families/${params.row.id}`} sx={linkSx}>
                    {params.value}
                  </Link>
                ),
              },
              {
                field: "primary_guardian_name",
                headerName: "Primary guardian",
                flex: 1,
                minWidth: 180,
                valueGetter: (value, row) => row?.primary_guardian_name || "—",
              },
              {
                field: "primary_email",
                headerName: "Email",
                flex: 1,
                minWidth: 220,
                valueGetter: (value, row) => row?.primary_email || "—",
              },
              {
                field: "primary_phone",
                headerName: "Phone",
                minWidth: 160,
                valueGetter: (value, row) => row?.primary_phone || "—",
              },
              {
                field: "athlete_count",
                headerName: "Athletes",
                width: 110,
                valueGetter: (value, row) => row?.athlete_count ?? 0,
              },
              {
                field: "guardian_count",
                headerName: "Guardians",
                width: 110,
                valueGetter: (value, row) => row?.guardian_count ?? 0,
              },
              {
                field: "location",
                headerName: "Location",
                flex: 0.8,
                minWidth: 160,
                valueGetter: (value, row) => [row?.city, row?.state].filter(Boolean).join(", ") || "—",
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
                      { label: "View", onClick: () => navigate(`/dashboard/families/${params.row.id}`) },
                      { label: "Edit", onClick: () => onEditFamily(params.row) },
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
