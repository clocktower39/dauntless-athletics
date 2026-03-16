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

export default function TeamsSection({
  classes,
  onAddTeam,
  teamSearch,
  onTeamSearchChange,
  teamOrgFilter,
  onTeamOrgFilterChange,
  teamSeasonFilter,
  onTeamSeasonFilterChange,
  schools,
  seasons,
  filteredTeams,
  onEditTeam,
  onDeleteTeam,
  seasonMap,
  onAddSeason,
  onEditSeason,
  onDeleteSeason,
}) {
  const navigate = useNavigate();
  const linkSx = { color: "var(--color-text)", fontWeight: 600, textDecoration: "none" };
  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>Teams</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Teams</Typography>
          </Box>
          <Button variant="contained" sx={classes.button} onClick={onAddTeam}>
            Add Team
          </Button>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <Box sx={classes.filterBar}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Search teams"
              value={teamSearch}
              onChange={(event) => onTeamSearchChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "220px" }}
            />
            <TextField
              select
              label="Organization"
              value={teamOrgFilter}
              onChange={(event) => onTeamOrgFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "200px" }}
            >
              <MenuItem value="all">All organizations</MenuItem>
              {schools.map((org) => (
                <MenuItem key={org.id} value={String(org.id)}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Season"
              value={teamSeasonFilter}
              onChange={(event) => onTeamSeasonFilterChange(event.target.value)}
              sx={{ ...classes.input, minWidth: "180px" }}
            >
              <MenuItem value="all">All seasons</MenuItem>
              {seasons.map((season) => (
                <MenuItem key={season.id} value={String(season.id)}>
                  {season.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        {filteredTeams.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No teams match the current filters.</Typography>
        ) : (
          <DataGrid
            rows={filteredTeams}
            columns={[
              {
                field: "name",
                headerName: "Team",
                flex: 1,
                minWidth: 200,
                renderCell: (params) => (
                  <Link component={RouterLink} to={`/dashboard/teams/${params.row.id}`} sx={linkSx}>
                    {params.value}
                  </Link>
                ),
              },
              {
                field: "organization_name",
                headerName: "Organization",
                flex: 1,
                minWidth: 200,
                valueGetter: (_value, row) => row?.organization_name || "—",
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
                field: "season_name",
                headerName: "Season",
                flex: 0.8,
                minWidth: 160,
                valueGetter: (_value, row) =>
                  row?.season_name ||
                  seasonMap.get(String(row?.season_id)) ||
                  row?.season ||
                  "—",
              },
              {
                field: "contact_count",
                headerName: "Contacts",
                width: 120,
                valueGetter: (_value, row) => row?.contact_count || 0,
              },
              {
                field: "athlete_count",
                headerName: "Athletes",
                width: 120,
                valueGetter: (_value, row) => row?.athlete_count || 0,
              },
              {
                field: "expected_athlete_count",
                headerName: "Target",
                width: 120,
                valueGetter: (_value, row) => row?.expected_athlete_count || 0,
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
                      { label: "View", onClick: () => navigate(`/dashboard/teams/${params.row.id}`) },
                      { label: "Edit", onClick: () => onEditTeam(params.row) },
                      { label: "Delete", onClick: () => onDeleteTeam(params.row.id), color: "danger" },
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

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Seasons</Typography>
            <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
              Manage active seasons for team assignments.
            </Typography>
          </Box>
          <Button variant="contained" sx={classes.button} onClick={onAddSeason}>
            Add Season
          </Button>
        </Box>
        {seasons.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No seasons yet.</Typography>
        ) : (
          <DataGrid
            rows={seasons}
            columns={[
              { field: "name", headerName: "Season", flex: 1, minWidth: 200 },
              {
                field: "dates",
                headerName: "Dates",
                flex: 1,
                minWidth: 220,
                valueGetter: (_value, row) => {
                  const start = row?.start_date ? String(row.start_date).slice(0, 10) : "—";
                  const end = row?.end_date ? String(row.end_date).slice(0, 10) : "";
                  return end ? `${start} → ${end}` : start;
                },
              },
              {
                field: "is_active",
                headerName: "Active",
                width: 120,
                valueGetter: (_value, row) => (row?.is_active ? "Active" : "Inactive"),
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
                      { label: "Edit", onClick: () => onEditSeason(params.row) },
                      { label: "Delete", onClick: () => onDeleteSeason(params.row.id), color: "danger" },
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
