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

export default function OrganizationsSection({
  classes,
  organizationSearch,
  onOrganizationSearchChange,
  organizationTypeFilter,
  onOrganizationTypeFilterChange,
  organizationParentFilter,
  onOrganizationParentFilterChange,
  organizationStatusFilter,
  onOrganizationStatusFilterChange,
  organizationTypeOptions,
  districts,
  filteredOrganizations,
  selectedOrganizationIds,
  onSelectedOrganizationIdsChange,
  onBulkArchive,
  onClearSelection,
  onNewOrganization,
  onViewOrganization,
  onEditOrganization,
  onDeleteOrganization,
  teamCountByOrg,
  districtMap,
  organizationTypeMap,
  formatDate,
}) {
  const rowSelectionModel = {
    type: "include",
    ids: new Set(selectedOrganizationIds ?? []),
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Organizations</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Organizations</Typography>
          </Box>
          <Button variant="contained" sx={classes.button} onClick={onNewOrganization}>
            New Organization
          </Button>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Search organizations"
              value={organizationSearch}
              onChange={(event) => onOrganizationSearchChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            />
            <TextField
              select
              label="Type"
              value={organizationTypeFilter}
              onChange={(event) => onOrganizationTypeFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "180px" }}
            >
              <MenuItem value="all">All types</MenuItem>
              {organizationTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Parent"
              value={organizationParentFilter}
              onChange={(event) => onOrganizationParentFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "180px" }}
            >
              <MenuItem value="all">All parents</MenuItem>
              <MenuItem value="none">Top-level only</MenuItem>
              {districts.map((org) => (
                <MenuItem key={org.id} value={String(org.id)}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={organizationStatusFilter}
              onChange={(event) => onOrganizationStatusFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "160px" }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </Box>

        {selectedOrganizationIds.length > 0 && (
          <Box sx={classes.bulkBar}>
            <Typography sx={{ color: "var(--color-text)" }}>
              {selectedOrganizationIds.length} selected
            </Typography>
            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={onBulkArchive}>
                Archive
              </Button>
              <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={onClearSelection}>
                Clear
              </Button>
            </Box>
          </Box>
        )}

        {filteredOrganizations.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>
            No organizations match the current filters.
          </Typography>
        ) : (
          <DataGrid
            rows={filteredOrganizations}
            columns={[
              { field: "name", headerName: "Organization", flex: 1, minWidth: 220 },
              {
                field: "type",
                headerName: "Type",
                width: 140,
                valueGetter: (_value, row) => organizationTypeMap.get(row?.type) || row?.type || "—",
              },
              {
                field: "parent_id",
                headerName: "Parent",
                flex: 1,
                minWidth: 180,
                valueGetter: (_value, row) => districtMap.get(String(row?.parent_id)) || "—",
              },
              {
                field: "team_count",
                headerName: "Teams",
                width: 120,
                valueGetter: (_value, row) => teamCountByOrg[row?.id] || 0,
              },
              {
                field: "status",
                headerName: "Status",
                width: 120,
                valueGetter: (_value, row) => row?.status || "active",
              },
              {
                field: "created_at",
                headerName: "Created",
                width: 160,
                valueGetter: (_value, row) => formatDate(row?.created_at),
              },
              {
                field: "actions",
                headerName: "Actions",
                minWidth: 220,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onViewOrganization(params.row)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onEditOrganization(params.row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onDeleteOrganization(params.row.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                ),
              },
            ]}
            checkboxSelection
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={(selection) =>
              onSelectedOrganizationIdsChange(Array.from(selection?.ids ?? []))
            }
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
