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
  allOrganizationsSelected,
  onToggleAllOrganizations,
  onToggleOrganizationSelection,
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
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>
                    <Checkbox
                      checked={allOrganizationsSelected}
                      onChange={onToggleAllOrganizations}
                      sx={{ color: "var(--color-muted)", "&.Mui-checked": { color: "var(--color-accent)" } }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tableHeadCell}>Organization</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Type</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Parent</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Teams</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Status</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Created</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id} hover>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrganizationIds.includes(org.id)}
                        onChange={() => onToggleOrganizationSelection(org.id)}
                        sx={{ color: "var(--color-muted)", "&.Mui-checked": { color: "var(--color-accent)" } }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {org.name}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {organizationTypeMap.get(org.type) || org.type || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {districtMap.get(String(org.parent_id)) || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {teamCountByOrg[org.id] || 0}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {org.status || "active"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {formatDate(org.created_at)}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onViewOrganization(org)}>
                          View
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditOrganization(org)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteOrganization(org.id)}>
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
