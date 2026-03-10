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
  teams,
  practices,
  selectedTeamId,
  onSelectedTeamChange,
  dayOptions,
  onAddPractice,
  onEditPractice,
  onDeletePractice,
  onAddSeason,
  onEditSeason,
  onDeleteSeason,
}) {
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
              { field: "name", headerName: "Team", flex: 1, minWidth: 200 },
              {
                field: "organization_name",
                headerName: "Organization",
                flex: 1,
                minWidth: 200,
                valueGetter: (_value, row) => row?.organization_name || "—",
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
                      onClick={() => onEditTeam(params.row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onDeleteTeam(params.row.id)}
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

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Practice Schedule</Typography>
            <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
              Maintain team practice blocks.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={classes.button}
            onClick={onAddPractice}
            disabled={teams.length === 0}
          >
            Add Practice
          </Button>
        </Box>
        {teams.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>
            Add a team first to create a practice schedule.
          </Typography>
        ) : (
          <>
            <TextField
              select
              label="Team"
              value={selectedTeamId}
              onChange={(event) => onSelectedTeamChange(event.target.value)}
              sx={{ ...classes.input, maxWidth: "320px" }}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            {practices.length === 0 ? (
              <Typography sx={{ color: "var(--color-muted)" }}>No practices scheduled yet.</Typography>
            ) : (
              <DataGrid
                rows={practices}
                columns={[
                  {
                    field: "day_of_week",
                    headerName: "Day",
                    width: 140,
                    valueGetter: (_value, row) =>
                      dayOptions.find((day) => day.value === row?.day_of_week)?.label || "—",
                  },
                  {
                    field: "time",
                    headerName: "Time",
                    width: 160,
                    valueGetter: (_value, row) =>
                      row?.start_time?.slice(0, 5) && row?.end_time?.slice(0, 5)
                        ? `${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}`
                        : "—",
                  },
                  {
                    field: "contact_name",
                    headerName: "Coach",
                    flex: 1,
                    minWidth: 160,
                    valueGetter: (_value, row) => row?.contact_name || "—",
                  },
                  {
                    field: "location",
                    headerName: "Location",
                    flex: 1,
                    minWidth: 160,
                    valueGetter: (_value, row) => row?.location || "—",
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
                          onClick={() => onEditPractice(params.row)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ color: "var(--color-text)" }}
                          onClick={() => onDeletePractice(params.row.id)}
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
          </>
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
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onEditSeason(params.row)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ color: "var(--color-text)" }}
                      onClick={() => onDeleteSeason(params.row.id)}
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
