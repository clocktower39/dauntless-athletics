import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PeopleSection from "../../../Components/Dashboard/PeopleSection";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setContacts, setOrganizations, setTeams } from "../../../store/dashboardSlice";

export default function PeoplePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const teams = useSelector((state) => state.dashboard.teams);
  const contacts = useSelector((state) => state.dashboard.contacts);
  const [dataError, setDataError] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [contactOrgFilter, setContactOrgFilter] = useState("all");
  const [contactTeamFilter, setContactTeamFilter] = useState("all");

  const authHeaders = useMemo(() => authHeader(token), [token]);

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
        contact.team_names,
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
        onAddContact={() => navigate("/dashboard/people/new")}
        filteredContacts={filteredContacts}
        onEditContact={(contact) => navigate(`/dashboard/people/${contact.id}?edit=1`)}
        onDeleteContact={handleDeleteContact}
      />
    </Box>
  );
}
