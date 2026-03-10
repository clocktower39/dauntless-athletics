import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import classes from "../dashboardStyles";
import { audienceOptions, emptyContact } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setContacts, setOrganizations, setTeams } from "../../../store/dashboardSlice";

export default function PeopleProfilePage() {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const contacts = useSelector((state) => state.dashboard.contacts);
  const [dataError, setDataError] = useState("");
  const [tab, setTab] = useState(0);
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(contactId === "new" || startEdit ? "edit" : "view");
  const [contactForm, setContactForm] = useState(emptyContact);

  const isNew = contactId === "new";
  const contactIdNumber = Number(contactId);
  const authHeaders = useMemo(() => authHeader(token), [token]);

  const contact = useMemo(() => {
    if (isNew) return null;
    return contacts.find((item) => Number(item.id) === contactIdNumber) || null;
  }, [contacts, contactIdNumber, isNew]);

  const teamMap = useMemo(() => new Map(teams.map((team) => [String(team.id), team])), [teams]);
  const orgMap = useMemo(() => new Map(organizations.map((org) => [String(org.id), org])), [organizations]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [teamRes, orgRes, contactRes] = await Promise.all([
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/contacts", { headers: authHeaders }),
        ]);
        dispatch(setTeams(teamRes.teams || []));
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setContacts(contactRes.contacts || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (isNew) {
      setContactForm(emptyContact);
      setMode("edit");
      return;
    }
    if (contact) {
      setContactForm({
        teamId: contact.team_id ? String(contact.team_id) : "",
        organizationId: contact.organization_id ? String(contact.organization_id) : "",
        name: contact.name || "",
        role: contact.role || "",
        audience: contact.audience || "Coach",
        email: contact.email || "",
        phone: contact.phone || "",
        notes: contact.notes || "",
      });
    }
  }, [contact, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const relatedTeams = useMemo(() => {
    if (!contactForm.organizationId) return teams;
    return teams.filter((team) => String(team.organization_id) === String(contactForm.organizationId));
  }, [teams, contactForm.organizationId]);

  const handleSave = async () => {
    try {
      setDataError("");
      const payload = {
        organization_id: contactForm.organizationId || null,
        team_id: contactForm.teamId || null,
        name: contactForm.name,
        role: contactForm.role,
        audience: contactForm.audience,
        email: contactForm.email,
        phone: contactForm.phone,
        notes: contactForm.notes,
      };
      let savedId = contactIdNumber;
      if (isNew) {
        const result = await apiRequest("/api/admin/contacts", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        savedId = result.contact?.id;
      } else if (contactIdNumber) {
        await apiRequest(`/api/admin/contacts/${contactIdNumber}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      const refreshed = await apiRequest("/api/admin/contacts", { headers: authHeaders });
      dispatch(setContacts(refreshed.contacts || []));
      if (savedId) {
        navigate(`/dashboard/people/${savedId}`);
      }
      setMode("view");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!contactIdNumber) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/contacts/${contactIdNumber}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/contacts", { headers: authHeaders });
      dispatch(setContacts(refreshed.contacts || []));
      navigate("/dashboard/people");
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {isNew ? "New Contact" : contact?.name || "Contact"}
            </Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / People / Profile</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/people")}>
              Back to list
            </Button>
            {mode === "view" ? (
              <Button variant="contained" sx={classes.button} onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <Button variant="contained" sx={classes.button} onClick={handleSave}>
                Save
              </Button>
            )}
            {!isNew && (
              <Button variant="outlined" color="error" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          sx={{ "& .MuiTab-root": { color: "var(--color-muted)" }, "& .Mui-selected": { color: "var(--color-text)" } }}
        >
          <Tab label="Overview" />
          <Tab label="Details" />
          <Tab label="Assignments" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Role</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {contactForm.role || "—"}
              </Typography>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: "12px" }}>
              <Box sx={classes.statCard}>
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Organization</Typography>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                  {contactForm.organizationId ? orgMap.get(String(contactForm.organizationId))?.name || "—" : "Unassigned"}
                </Typography>
              </Box>
              <Box sx={classes.statCard}>
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Team</Typography>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                  {contactForm.teamId ? teamMap.get(String(contactForm.teamId))?.name || "—" : "Unassigned"}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "720px" }}>
            <TextField
              label="Contact name"
              value={contactForm.name}
              onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
              sx={classes.input}
              disabled={mode === "view"}
            />
            <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <TextField
                label="Role / Title"
                value={contactForm.role}
                onChange={(event) => setContactForm((prev) => ({ ...prev, role: event.target.value }))}
                sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                disabled={mode === "view"}
              />
              <TextField
                select
                label="Audience"
                value={contactForm.audience}
                onChange={(event) => setContactForm((prev) => ({ ...prev, audience: event.target.value }))}
                sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                disabled={mode === "view"}
              >
                {audienceOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <TextField
                label="Email"
                value={contactForm.email}
                onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                disabled={mode === "view"}
              />
              <TextField
                label="Phone"
                value={contactForm.phone}
                onChange={(event) => setContactForm((prev) => ({ ...prev, phone: event.target.value }))}
                sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
                disabled={mode === "view"}
              />
            </Box>
            <TextField
              label="Notes"
              value={contactForm.notes}
              onChange={(event) => setContactForm((prev) => ({ ...prev, notes: event.target.value }))}
              sx={classes.input}
              multiline
              minRows={2}
              disabled={mode === "view"}
            />
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
            <TextField
              select
              label="Organization (optional)"
              value={contactForm.organizationId}
              onChange={(event) => {
                const nextOrg = event.target.value;
                setContactForm((prev) => {
                  const nextTeamId =
                    nextOrg && prev.teamId
                      ? String(teamMap.get(String(prev.teamId))?.organization_id || "") === nextOrg
                        ? prev.teamId
                        : ""
                      : prev.teamId;
                  return { ...prev, organizationId: nextOrg, teamId: nextTeamId };
                });
              }}
              sx={classes.input}
              disabled={mode === "view"}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={String(org.id)}>
                  {org.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Team (optional)"
              value={contactForm.teamId}
              onChange={(event) => {
                const nextTeamId = event.target.value;
                setContactForm((prev) => {
                  const nextOrgId =
                    nextTeamId && teamMap.get(String(nextTeamId))?.organization_id
                      ? String(teamMap.get(String(nextTeamId))?.organization_id)
                      : prev.organizationId;
                  return { ...prev, teamId: nextTeamId, organizationId: nextOrgId };
                });
              }}
              sx={classes.input}
              disabled={mode === "view"}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {relatedTeams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </TextField>
            {contactForm.teamId && (
              <DataGrid
                rows={relatedTeams.filter((team) => String(team.id) === String(contactForm.teamId))}
                columns={[
                  { field: "name", headerName: "Team", flex: 1, minWidth: 200 },
                  { field: "level", headerName: "Level", width: 140 },
                  { field: "season_name", headerName: "Season", width: 160 },
                ]}
                autoHeight
                density="compact"
                disableRowSelectionOnClick
                hideFooter
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
                sx={classes.dataGrid}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
