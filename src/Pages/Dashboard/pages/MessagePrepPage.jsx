import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";

export default function MessagePrepPage({ embedded = false }) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [contacts, setContacts] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const selectedItem = useMemo(
    () => items.find((item) => String(item.id) === String(selectedId)) || null,
    [items, selectedId]
  );

  const { contactsByTeamId, contactsByTeamName } = useMemo(() => {
    const byId = new Map();
    const byName = new Map();
    contacts.forEach((contact) => {
      if (contact.team_id) {
        const key = String(contact.team_id);
        if (!byId.has(key)) byId.set(key, []);
        byId.get(key).push(contact);
      }
      const teamNames = contact.team_names
        ? String(contact.team_names).split(",").map((name) => name.trim()).filter(Boolean)
        : contact.team_name
          ? [String(contact.team_name).trim()]
          : [];
      teamNames.forEach((teamName) => {
        const key = teamName.toLowerCase();
        if (!byName.has(key)) byName.set(key, []);
        byName.get(key).push(contact);
      });
      if (Array.isArray(contact.team_ids)) {
        contact.team_ids.forEach((teamId) => {
          const key = String(teamId);
          if (!byId.has(key)) byId.set(key, []);
          byId.get(key).push(contact);
        });
      }
    });
    return { contactsByTeamId: byId, contactsByTeamName: byName };
  }, [contacts]);

  const getContactsForItem = (item) => {
    if (!item) return [];
    const teamId = item.team_id ? String(item.team_id) : null;
    const teamName = (item.team || "").trim().toLowerCase();
    if (teamId && contactsByTeamId.has(teamId)) {
      return contactsByTeamId.get(teamId);
    }
    if (teamName && contactsByTeamName.has(teamName)) {
      return contactsByTeamName.get(teamName);
    }
    return [];
  };

  const pickCoachContacts = (list) => {
    if (!list || list.length === 0) return [];
    const coachMatches = list.filter((contact) => {
      const role = `${contact.role || ""} ${contact.audience || ""} ${contact.name || ""}`.toLowerCase();
      return role.includes("coach");
    });
    return coachMatches.length > 0 ? coachMatches : list;
  };

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const result = await apiRequest("/api/admin/contacts", { headers: authHeader(token) });
        setContacts(result.contacts || []);
      } catch (err) {
        setContacts([]);
      }
    };
    load();
  }, [token]);

  const teamContacts = useMemo(() => {
    if (!selectedItem) return [];
    return pickCoachContacts(getContactsForItem(selectedItem));
  }, [selectedItem, contactsByTeamId, contactsByTeamName]);

  const getContactSummary = (item) => {
    const list = pickCoachContacts(getContactsForItem(item));
    if (!list || list.length === 0) return "None";
    let emailOnly = 0;
    let phoneOnly = 0;
    let both = 0;
    list.forEach((contact) => {
      const hasEmail = Boolean(contact.email);
      const hasPhone = Boolean(contact.phone);
      if (hasEmail && hasPhone) {
        both += 1;
      } else if (hasEmail) {
        emailOnly += 1;
      } else if (hasPhone) {
        phoneOnly += 1;
      }
    });
    const parts = [];
    if (both) parts.push(`Both: ${both}`);
    if (emailOnly) parts.push(`Email: ${emailOnly}`);
    if (phoneOnly) parts.push(`Phone: ${phoneOnly}`);
    return parts.length > 0 ? parts.join(" • ") : "None";
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = reader.result;
        const parsed = typeof raw === "string" ? JSON.parse(raw) : JSON.parse(String(raw));
        const list = Array.isArray(parsed) ? parsed : parsed.items || [];
        const normalized = list
          .filter(Boolean)
          .map((item, index) => ({
            id: item.id || `${index + 1}`,
            team: item.team || "Unknown team",
            team_id: item.team_id || item.teamId || null,
            link: item.link || "",
            survey: item.survey || "",
            email_subject: item.email_subject || "",
            email_body: item.email_body || "",
            text_message: item.text_message || "",
          }));
        setItems(normalized);
        setSelectedId(normalized[0]?.id ?? null);
      } catch (err) {
        setError("Unable to parse JSON. Please upload the copied JSON file.");
        setItems([]);
        setSelectedId(null);
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setItems([]);
    setSelectedId(null);
    setError("");
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      <Box sx={classes.section}>
        {!embedded && (
          <Box sx={classes.workspaceHeader}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
                Message Prep
              </Typography>
              <Typography sx={classes.breadcrumb}>Dashboard / Message Prep</Typography>
            </Box>
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <Button variant="contained" component="label" sx={classes.button}>
            Import JSON
            <input type="file" accept="application/json" hidden onChange={handleFileChange} />
          </Button>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleClear}>
            Clear
          </Button>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Files stay in your browser only. Nothing is uploaded or saved.
          </Typography>
        </Box>
      </Box>

      <Box sx={classes.section}>
        <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Imported Links</Typography>
        {items.length === 0 ? (
          <Typography sx={{ color: "var(--color-muted)" }}>No JSON loaded yet.</Typography>
        ) : (
          <DataGrid
            rows={items}
            columns={[
              { field: "team", headerName: "Team", flex: 1, minWidth: 220 },
              { field: "survey", headerName: "Survey", flex: 1, minWidth: 220 },
              {
                field: "contact_info",
                headerName: "Coach Contact Info",
                flex: 1,
                minWidth: 220,
                valueGetter: (_value, row) => getContactSummary(row),
              },
              { field: "link", headerName: "Link", flex: 1, minWidth: 320 },
            ]}
            autoHeight
            density="compact"
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
            sx={classes.dataGrid}
            onRowClick={(params) => setSelectedId(params.row.id)}
          />
        )}
      </Box>

      {selectedItem && (
        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
            Contacts — {selectedItem.team}
          </Typography>
          {teamContacts.length === 0 ? (
            <Typography sx={{ color: "var(--color-muted)" }}>
              No coach contacts found for this team.
            </Typography>
          ) : (
            <DataGrid
              rows={teamContacts.map((contact) => ({ ...contact, id: contact.id }))}
              columns={[
                { field: "name", headerName: "Coach", flex: 1, minWidth: 200 },
                { field: "role", headerName: "Role", flex: 1, minWidth: 160 },
                { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
                { field: "phone", headerName: "Phone", flex: 1, minWidth: 160 },
              ]}
              autoHeight
              density="compact"
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } } }}
              sx={classes.dataGrid}
            />
          )}
        </Box>
      )}

      {selectedItem && (
        <Box sx={classes.section}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>
            Preview — {selectedItem.team}
          </Typography>
          <Box sx={{ display: "grid", gap: "12px" }}>
            <Box>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>
                Email Subject
              </Typography>
              <Typography sx={{ color: "var(--color-text)" }}>{selectedItem.email_subject || "—"}</Typography>
            </Box>
            <Box>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>
                Email Body
              </Typography>
              <Box
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  background: "var(--color-surface-3)",
                  borderRadius: "12px",
                  padding: "12px",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-mono, 'SFMono-Regular', monospace)",
                }}
              >
                {selectedItem.email_body || "—"}
              </Box>
            </Box>
            <Box>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.8rem" }}>
                Text Message
              </Typography>
              <Box
                component="pre"
                sx={{
                  whiteSpace: "pre-wrap",
                  background: "var(--color-surface-3)",
                  borderRadius: "12px",
                  padding: "12px",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-mono, 'SFMono-Regular', monospace)",
                }}
              >
                {selectedItem.text_message || "—"}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
