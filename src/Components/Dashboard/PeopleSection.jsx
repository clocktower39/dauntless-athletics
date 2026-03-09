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

export default function PeopleSection({
  classes,
  peopleView,
  onPeopleViewChange,
  peopleSearch,
  onPeopleSearchChange,
  organizations = [],
  contactOrgFilter = "all",
  onContactOrgFilterChange,
  contactTeamFilter = "all",
  onContactTeamFilterChange,
  contactTeamOptions = [],
  onAddCoach,
  onAddContact,
  filteredCoaches,
  filteredContacts,
  onAssignCoach,
  onEditCoach,
  onDeleteCoach,
  onEditContact,
  onDeleteContact,
}) {
  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>People</Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / People</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              variant={peopleView === "coaches" ? "contained" : "outlined"}
              size="small"
              sx={peopleView === "coaches" ? classes.button : { color: "var(--color-text)" }}
              onClick={() => onPeopleViewChange("coaches")}
            >
              Coaches
            </Button>
            <Button
              variant={peopleView === "contacts" ? "contained" : "outlined"}
              size="small"
              sx={peopleView === "contacts" ? classes.button : { color: "var(--color-text)" }}
              onClick={() => onPeopleViewChange("contacts")}
            >
              Contacts
            </Button>
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
            {peopleView === "contacts" && (
              <>
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
              </>
            )}
            <Box sx={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
              {peopleView === "coaches" ? (
                <Button variant="contained" sx={classes.button} onClick={onAddCoach}>
                  Add Coach
                </Button>
              ) : (
                <Button variant="contained" sx={classes.button} onClick={onAddContact}>
                  Add Contact
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {peopleView === "coaches" ? (
          <>
            {filteredCoaches.length === 0 ? (
              <Typography sx={{ color: "var(--color-muted)" }}>No coaches yet.</Typography>
            ) : (
              <TableContainer component={Paper} sx={classes.tablePaper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={classes.tableHeadCell}>Coach</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Email</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Phone</TableCell>
                      <TableCell sx={classes.tableHeadCell}>Teams</TableCell>
                      <TableCell sx={classes.tableHeadCell} align="right">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCoaches.map((coach) => (
                      <TableRow key={coach.id} hover>
                        <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                          {coach.name}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {coach.email || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {coach.phone || "—"}
                        </TableCell>
                        <TableCell sx={{ color: "var(--color-text)" }}>
                          {coach.team_count || 0}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onAssignCoach(coach)}>
                              Assign
                            </Button>
                            <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditCoach(coach)}>
                              Edit
                            </Button>
                            <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteCoach(coach.id)}>
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
        ) : filteredContacts.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No contacts yet.</Typography>
        ) : (
          <TableContainer component={Paper} sx={classes.tablePaper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={classes.tableHeadCell}>Name</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Role</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Audience</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Organization</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Team</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Email</TableCell>
                  <TableCell sx={classes.tableHeadCell}>Phone</TableCell>
                  <TableCell sx={classes.tableHeadCell} align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                      {contact.name}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {contact.role || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {contact.audience || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {contact.organization_name || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {contact.team_name || "Unassigned"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {contact.email || "—"}
                    </TableCell>
                    <TableCell sx={{ color: "var(--color-text)" }}>
                      {contact.phone || "—"}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onEditContact(contact)}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" sx={{ color: "var(--color-text)" }} onClick={() => onDeleteContact(contact.id)}>
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
