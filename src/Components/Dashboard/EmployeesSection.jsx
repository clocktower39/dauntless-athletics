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

export default function EmployeesSection({
  classes,
  employeeSearch,
  onEmployeeSearchChange,
  statusFilter,
  onStatusFilterChange,
  employees = [],
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}) {
  const navigate = useNavigate();
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Employees</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Employees</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              label="Search"
              value={employeeSearch}
              onChange={(event) => onEmployeeSearchChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            />
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
              <Button variant="contained" sx={classes.button} onClick={onAddEmployee}>
                Add Employee
              </Button>
            </Box>
          </Box>
        </Box>
        {employees.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No employees yet.</Typography>
        ) : (
          <DataGrid
            rows={employees}
            columns={[
              {
                field: "full_name",
                headerName: "Employee",
                flex: 1,
                minWidth: 200,
                valueGetter: (_value, row) =>
                  row?.preferred_name ||
                  [row?.first_name, row?.last_name].filter(Boolean).join(" ") ||
                  "—",
                renderCell: (params) => (
                  <Link component={RouterLink} to={`/dashboard/employees/${params.row.id}`} sx={linkSx}>
                    {params.value}
                  </Link>
                ),
              },
              {
                field: "title_summary",
                headerName: "Assignments",
                flex: 1,
                minWidth: 220,
                valueGetter: (_value, row) => row?.title_summary || "—",
              },
              {
                field: "department_summary",
                headerName: "Departments",
                flex: 0.9,
                minWidth: 180,
                valueGetter: (_value, row) => row?.department_summary || "—",
              },
              {
                field: "employment_types",
                headerName: "Work Type",
                flex: 0.9,
                minWidth: 180,
                valueGetter: (_value, row) => (row?.employment_types || []).join(", ") || "—",
              },
              {
                field: "role_count",
                headerName: "Role Count",
                width: 110,
                valueGetter: (_value, row) => row?.role_count || 0,
              },
              {
                field: "email",
                headerName: "Email",
                flex: 1,
                minWidth: 220,
                valueGetter: (_value, row) => row?.email || "—",
              },
              {
                field: "phone",
                headerName: "Phone",
                minWidth: 150,
                valueGetter: (_value, row) => row?.phone || "—",
              },
              {
                field: "status",
                headerName: "Status",
                width: 110,
                valueGetter: (_value, row) => row?.status || "—",
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
                      { label: "View", onClick: () => navigate(`/dashboard/employees/${params.row.id}`) },
                      { label: "Edit", onClick: () => onEditEmployee(params.row) },
                      { label: "Delete", onClick: () => onDeleteEmployee(params.row.id), color: "danger" },
                    ]}
                  />
                ),
              },
            ]}
            autoHeight
            density="compact"
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
            sx={classes.dataGrid}
          />
        )}
      </Box>
    </Box>
  );
}
