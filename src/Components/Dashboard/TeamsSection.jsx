import React from "react";
import {
  Box,
  Button,
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
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Organization</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Season</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Contacts</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id} hover>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {team.name}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {team.organization_name || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {team.season_name || seasonMap.get(String(team.season_id)) || team.season || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {team.contact_count || 0}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditTeam(team)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteTeam(team.id)}>
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
              <TableContainer component={Paper} sx={classes.tablePaper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={classes.tableHeadCell}>Day</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Time</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Coach</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Location</TableCell>
                      <TableCell sx={classes.tableHeadCell} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {practices.map((practice) => (
                      <TableRow key={practice.id} hover>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {dayOptions.find((day) => day.value === practice.day_of_week)?.label || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {practice.start_time?.slice(0, 5)} - {practice.end_time?.slice(0, 5)}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {practice.contact_name || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {practice.location || "—"}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditPractice(practice)}>
                              Edit
                            </Button>
                            <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeletePractice(practice.id)}>
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
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>Season</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Dates</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Active</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seasons.map((season) => (
                  <TableRow key={season.id} hover>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {season.name}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {season.start_date ? String(season.start_date).slice(0, 10) : "—"}{" "}
                      {season.end_date ? `→ ${String(season.end_date).slice(0, 10)}` : ""}
                    </TableCell>
                    <TableCell sx={{ color: season.is_active ? "var(--color-accent)" : "var(--color-muted)" }}>
                      {season.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditSeason(season)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteSeason(season.id)}>
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
