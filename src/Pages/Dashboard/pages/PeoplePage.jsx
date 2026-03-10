import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import PeopleSection from "../../../Components/Dashboard/PeopleSection";
import classes from "../dashboardStyles";
import { audienceOptions, emptyContact } from "../dashboardConstants";
import { apiRequest, authHeader } from "../surveyApi";
import { setContacts, setOrganizations, setTeams } from "../../../store/dashboardSlice";

export default function PeoplePage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const contacts = useSelector((state) => state.dashboard.contacts);
  const [dataError, setDataError] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [contactOrgFilter, setContactOrgFilter] = useState("all");
  const [contactTeamFilter, setContactTeamFilter] = useState("all");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState(emptyContact);
  const [editingContactId, setEditingContactId] = useState(null);

  const authHeaders = useMemo(() => authHeader(token), [token]);
  const teamMap = useMemo(() => new Map(teams.map((team) => [String(team.id), team])), [teams]);

  const contactTeamOptions = useMemo(() => {
    if (contactOrgFilter === "all") return teams;
    return teams.filter((team) => String(team.organization_id) === contactOrgFilter);
  }, [teams, contactOrgFilter]);

  const filteredContacts = useMemo(() => {
    const term = peopleSearch.trim().toLowerCase();
    if (!term) return contacts;
    return contacts.filter((contact) =>
      [
        contact.name,
        contact.role,
        contact.audience,
        contact.email,
        contact.phone,
        contact.organization_name,
        contact.team_name,
      ]
        .some((field) => String(field || "").toLowerCase().includes(term))
    );
  }, [contacts, peopleSearch]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [teamRes, orgRes] = await Promise.all([
          apiRequest("/api/admin/teams", { headers: authHeaders }),
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
        ]);
        dispatch(setTeams(teamRes.teams || []));
        dispatch(setOrganizations(orgRes.organizations || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (contactOrgFilter !== "all" && contactTeamFilter !== "all" && contactTeamFilter !== "unassigned") {
      const stillValid = contactTeamOptions.some((team) => String(team.id) === contactTeamFilter);
      if (!stillValid) {
        setContactTeamFilter("all");
      }
    }
  }, [contactOrgFilter, contactTeamFilter, contactTeamOptions]);

  useEffect(() => {
    if (!token) return;
    const loadContacts = async () => {
      try {
        const params = new URLSearchParams();
        if (contactTeamFilter === "unassigned") {
          params.set("unassigned", "1");
        } else if (contactTeamFilter !== "all") {
          params.set("team_id", contactTeamFilter);
        }
        if (contactOrgFilter !== "all") {
          params.set("organization_id", contactOrgFilter);
        }
        const query = params.toString() ? `?${params.toString()}` : "";
        const result = await apiRequest(`/api/admin/contacts${query}`, { headers: authHeaders });
        dispatch(setContacts(result.contacts || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    loadContacts();
  }, [token, contactOrgFilter, contactTeamFilter, authHeaders, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newParam = params.get("new");
    if (newParam === "contact") {
      handleOpenContactModal();
    }
  }, [location.search]);

  const handleOpenContactModal = (contact = null) => {
    if (contact) {
      const resolvedOrgId =
        contact.organization_id
          ? String(contact.organization_id)
          : contact.team_id
            ? String(teamMap.get(String(contact.team_id))?.organization_id || "")
            : "";
      setEditingContactId(contact.id);
      setContactForm({
        teamId: contact.team_id ? String(contact.team_id) : "",
        organizationId: resolvedOrgId,
        name: contact.name || "",
        role: contact.role || "",
        audience: contact.audience || "Coach",
        email: contact.email || "",
        phone: contact.phone || "",
        notes: contact.notes || "",
      });
    } else {
      setEditingContactId(null);
      const defaultOrgId = contactOrgFilter !== "all" ? contactOrgFilter : "";
      const defaultTeamId =
        contactTeamFilter !== "all" && contactTeamFilter !== "unassigned"
          ? contactTeamFilter
          : "";
      const resolvedOrgId =
        defaultTeamId && teamMap.get(String(defaultTeamId))?.organization_id
          ? String(teamMap.get(String(defaultTeamId))?.organization_id)
          : defaultOrgId;
      setContactForm({
        ...emptyContact,
        teamId: defaultTeamId,
        organizationId: resolvedOrgId,
      });
    }
    setContactModalOpen(true);
  };

  const handleSaveContact = async () => {
    if (!contactForm.name.trim()) {
      setDataError("Contact name is required.");
      return;
    }
    try {
      setDataError("");
      const payload = {
        team_id: contactForm.teamId ? Number(contactForm.teamId) : null,
        organization_id: contactForm.organizationId ? Number(contactForm.organizationId) : null,
        name: contactForm.name.trim(),
        role: contactForm.role.trim(),
        audience: contactForm.audience,
        email: contactForm.email.trim(),
        phone: contactForm.phone.trim(),
        notes: contactForm.notes.trim(),
      };
      if (editingContactId) {
        await apiRequest(`/api/admin/contacts/${editingContactId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/admin/contacts", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }
      const params = new URLSearchParams();
      if (contactTeamFilter === "unassigned") {
        params.set("unassigned", "1");
      } else if (contactTeamFilter !== "all") {
        params.set("team_id", contactTeamFilter);
      }
      if (contactOrgFilter !== "all") {
        params.set("organization_id", contactOrgFilter);
      }
      const query = params.toString() ? `?${params.toString()}` : "";
      const result = await apiRequest(`/api/admin/contacts${query}`, { headers: authHeaders });
      dispatch(setContacts(result.contacts || []));
      setContactModalOpen(false);
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/contacts/${contactId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const params = new URLSearchParams();
      if (contactTeamFilter === "unassigned") {
        params.set("unassigned", "1");
      } else if (contactTeamFilter !== "all") {
        params.set("team_id", contactTeamFilter);
      }
      if (contactOrgFilter !== "all") {
        params.set("organization_id", contactOrgFilter);
      }
      const query = params.toString() ? `?${params.toString()}` : "";
      const result = await apiRequest(`/api/admin/contacts${query}`, { headers: authHeaders });
      dispatch(setContacts(result.contacts || []));
    } catch (error) {
      setDataError(error.message);
    }
  };


  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <PeopleSection
        classes={classes}
        peopleSearch={peopleSearch}
        onPeopleSearchChange={setPeopleSearch}
        organizations={organizations}
        contactOrgFilter={contactOrgFilter}
        onContactOrgFilterChange={setContactOrgFilter}
        contactTeamFilter={contactTeamFilter}
        onContactTeamFilterChange={setContactTeamFilter}
        contactTeamOptions={contactTeamOptions}
        onAddContact={() => handleOpenContactModal()}
        filteredContacts={filteredContacts}
        onEditContact={handleOpenContactModal}
        onDeleteContact={handleDeleteContact}
      />

      <Dialog
        open={contactModalOpen}
        onClose={() => {
          if (editingContactId) {
            setEditingContactId(null);
          }
          setContactModalOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingContactId ? "Edit Contact" : "Add Contact"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
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
          >
            <MenuItem value="">Unassigned</MenuItem>
            {(contactForm.organizationId
              ? teams.filter(
                  (team) => String(team.organization_id) === String(contactForm.organizationId)
                )
              : teams
            ).map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Contact name"
            value={contactForm.name}
            onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
            sx={classes.input}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Role / Title"
              value={contactForm.role}
              onChange={(event) => setContactForm((prev) => ({ ...prev, role: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              select
              label="Audience"
              value={contactForm.audience}
              onChange={(event) => setContactForm((prev) => ({ ...prev, audience: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
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
            />
            <TextField
              label="Phone"
              value={contactForm.phone}
              onChange={(event) => setContactForm((prev) => ({ ...prev, phone: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
          </Box>
          <TextField
            label="Notes"
            value={contactForm.notes}
            onChange={(event) => setContactForm((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            sx={{ color: "var(--color-text)" }}
            onClick={() => {
              if (editingContactId) {
                setEditingContactId(null);
              }
              setContactModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveContact}>
            {editingContactId ? "Save Contact" : "Add Contact"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
