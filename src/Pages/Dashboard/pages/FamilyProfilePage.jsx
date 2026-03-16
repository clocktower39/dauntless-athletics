import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RowActionsMenu from "../../../Components/Dashboard/RowActionsMenu";
import { emptyFamily, emptyGuardian } from "../dashboardConstants";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setFamilies, setOrganizations } from "../../../store/dashboardSlice";

const formatMoney = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return amount.toLocaleString(undefined, { style: "currency", currency: "USD" });
};

export default function FamilyProfilePage() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const families = useSelector((state) => state.dashboard.families);
  const [dataError, setDataError] = useState("");
  const [familyDraft, setFamilyDraft] = useState(emptyFamily);
  const [guardians, setGuardians] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [guardianModalOpen, setGuardianModalOpen] = useState(false);
  const [guardianDraft, setGuardianDraft] = useState(emptyGuardian);
  const [editingGuardianId, setEditingGuardianId] = useState(null);
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(familyId === "new" || startEdit ? "edit" : "view");

  const isNew = familyId === "new";
  const familyIdNumber = Number(familyId);
  const authHeaders = useMemo(() => authHeader(token), [token]);

  const family = useMemo(() => {
    if (isNew) return null;
    return families.find((item) => Number(item.id) === familyIdNumber) || null;
  }, [families, familyIdNumber, isNew]);

  const organizationMap = useMemo(
    () => new Map(organizations.map((org) => [String(org.id), org.name])),
    [organizations]
  );

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [orgRes, familyListRes] = await Promise.all([
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
          apiRequest("/api/admin/families", { headers: authHeaders }),
        ]);
        dispatch(setOrganizations(orgRes.organizations || []));
        dispatch(setFamilies(familyListRes.families || []));

        if (!isNew && familyIdNumber) {
          const familyDetail = await apiRequest(`/api/admin/families/${familyIdNumber}`, { headers: authHeaders });
          setGuardians(familyDetail.guardians || []);
          setAthletes(familyDetail.athletes || []);
        } else {
          setGuardians([]);
          setAthletes([]);
        }
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch, isNew, familyIdNumber]);

  useEffect(() => {
    if (isNew) {
      setFamilyDraft(emptyFamily);
      setMode("edit");
      return;
    }

    if (family) {
      setFamilyDraft({
        name: family.name || "",
        status: family.status || "active",
        primaryGuardianName: family.primary_guardian_name || "",
        primaryEmail: family.primary_email || "",
        primaryPhone: family.primary_phone || "",
        street1: family.street_1 || "",
        street2: family.street_2 || "",
        city: family.city || "",
        state: family.state || "",
        postalCode: family.postal_code || "",
        country: family.country || "USA",
        balanceDue: family.balance_due ?? "",
        lastPaymentDate: family.last_payment_date ? String(family.last_payment_date).slice(0, 10) : "",
        lastPaymentAmount: family.last_payment_amount ?? "",
        notes: family.notes || "",
      });
    }
  }, [family, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const reloadFamily = async (id = familyIdNumber) => {
    if (!id) return;
    const [familyListRes, familyDetail] = await Promise.all([
      apiRequest("/api/admin/families", { headers: authHeaders }),
      apiRequest(`/api/admin/families/${id}`, { headers: authHeaders }),
    ]);
    dispatch(setFamilies(familyListRes.families || []));
    setGuardians(familyDetail.guardians || []);
    setAthletes(familyDetail.athletes || []);
  };

  const handleSaveFamily = async () => {
    if (!familyDraft.name.trim()) {
      setDataError("Family name is required.");
      return;
    }

    try {
      setDataError("");
      const payload = {
        name: familyDraft.name.trim(),
        status: familyDraft.status,
        primary_guardian_name: familyDraft.primaryGuardianName.trim(),
        primary_email: familyDraft.primaryEmail.trim(),
        primary_phone: familyDraft.primaryPhone.trim(),
        street_1: familyDraft.street1.trim(),
        street_2: familyDraft.street2.trim(),
        city: familyDraft.city.trim(),
        state: familyDraft.state.trim(),
        postal_code: familyDraft.postalCode.trim(),
        country: familyDraft.country.trim(),
        balance_due: familyDraft.balanceDue === "" ? null : Number(familyDraft.balanceDue),
        last_payment_date: familyDraft.lastPaymentDate || null,
        last_payment_amount: familyDraft.lastPaymentAmount === "" ? null : Number(familyDraft.lastPaymentAmount),
        notes: familyDraft.notes.trim(),
      };

      let savedId = familyIdNumber;
      if (isNew) {
        const result = await apiRequest("/api/admin/families", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        savedId = result.family?.id;
      } else {
        await apiRequest(`/api/admin/families/${familyIdNumber}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }

      await reloadFamily(savedId);
      if (savedId) {
        navigate(`/dashboard/families/${savedId}`);
      }
      setMode("view");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleOpenGuardianModal = (guardian = null) => {
    if (guardian) {
      setEditingGuardianId(guardian.id);
      setGuardianDraft({
        firstName: guardian.first_name || "",
        lastName: guardian.last_name || "",
        fullName: guardian.full_name || "",
        email: guardian.email || "",
        phone: guardian.phone || "",
        isPrimaryGuardian: Boolean(guardian.is_primary_guardian),
        status: guardian.status || "active",
        notes: guardian.notes || "",
      });
    } else {
      setEditingGuardianId(null);
      setGuardianDraft(emptyGuardian);
    }
    setGuardianModalOpen(true);
  };

  const handleCloseGuardianModal = () => {
    setEditingGuardianId(null);
    setGuardianDraft(emptyGuardian);
    setGuardianModalOpen(false);
  };

  const handleSaveGuardian = async () => {
    if (!familyIdNumber && !isNew) return;
    try {
      setDataError("");
      const payload = {
        family_id: familyIdNumber,
        first_name: guardianDraft.firstName.trim(),
        last_name: guardianDraft.lastName.trim(),
        full_name: guardianDraft.fullName.trim(),
        email: guardianDraft.email.trim(),
        phone: guardianDraft.phone.trim(),
        is_primary_guardian: guardianDraft.isPrimaryGuardian,
        status: guardianDraft.status,
        notes: guardianDraft.notes.trim(),
      };

      if (editingGuardianId) {
        await apiRequest(`/api/admin/parents/${editingGuardianId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/admin/parents", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }

      await reloadFamily();
      handleCloseGuardianModal();
    } catch (error) {
      setDataError(error.message);
    }
  };

  const fullAddress = [
    familyDraft.street1,
    familyDraft.street2,
    [familyDraft.city, familyDraft.state, familyDraft.postalCode].filter(Boolean).join(", "),
    familyDraft.country,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {isNew ? "New Family" : familyDraft.name || "Family"}
            </Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Families / Profile</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/families")}>
              Back to list
            </Button>
            {mode === "view" ? (
              <Button variant="contained" sx={classes.button} onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <Button variant="contained" sx={classes.button} onClick={handleSaveFamily}>
                Save
              </Button>
            )}
          </Box>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Overview</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: "12px" }}>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Primary guardian</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {familyDraft.primaryGuardianName || "—"}
              </Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Guardians</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{guardians.length}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Athletes</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{athletes.length}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Balance due</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {formatMoney(familyDraft.balanceDue)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "880px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Details</Typography>
          <TextField
            label="Family name"
            value={familyDraft.name}
            onChange={(event) => setFamilyDraft((prev) => ({ ...prev, name: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Primary guardian"
              value={familyDraft.primaryGuardianName}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, primaryGuardianName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "220px" }}
              disabled={mode === "view"}
            />
            <TextField
              select
              label="Status"
              value={familyDraft.status}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, status: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Primary email"
              value={familyDraft.primaryEmail}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, primaryEmail: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "220px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Primary phone"
              value={familyDraft.primaryPhone}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, primaryPhone: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "220px" }}
              disabled={mode === "view"}
            />
          </Box>
          <TextField
            label="Street 1"
            value={familyDraft.street1}
            onChange={(event) => setFamilyDraft((prev) => ({ ...prev, street1: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <TextField
            label="Street 2"
            value={familyDraft.street2}
            onChange={(event) => setFamilyDraft((prev) => ({ ...prev, street2: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="City"
              value={familyDraft.city}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, city: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="State"
              value={familyDraft.state}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, state: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "120px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Postal code"
              value={familyDraft.postalCode}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, postalCode: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "140px" }}
              disabled={mode === "view"}
            />
          </Box>
          <TextField
            label="Country"
            value={familyDraft.country}
            onChange={(event) => setFamilyDraft((prev) => ({ ...prev, country: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Balance due"
              type="number"
              value={familyDraft.balanceDue}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, balanceDue: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Last payment amount"
              type="number"
              value={familyDraft.lastPaymentAmount}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, lastPaymentAmount: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              type="date"
              label="Last payment date"
              value={familyDraft.lastPaymentDate}
              onChange={(event) => setFamilyDraft((prev) => ({ ...prev, lastPaymentDate: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
              disabled={mode === "view"}
            />
          </Box>
          <TextField
            label="Notes"
            value={familyDraft.notes}
            onChange={(event) => setFamilyDraft((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={3}
            disabled={mode === "view"}
          />
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "8px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Household</Typography>
          <Box sx={classes.statCard}>
            <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Address</Typography>
            <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{fullAddress || "—"}</Typography>
          </Box>
          <Box sx={classes.statCard}>
            <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Organization</Typography>
            <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
              {family?.org_id ? organizationMap.get(String(family.org_id)) || `Org ${family.org_id}` : "—"}
            </Typography>
          </Box>
        </Box>

        {!isNew && (
          <>
            <Divider sx={{ borderColor: "var(--color-border)" }} />

            <Box sx={{ paddingTop: "8px" }}>
              <Box sx={classes.workspaceHeader}>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Guardians</Typography>
                  <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    Parents and guardians tied to this family account.
                  </Typography>
                </Box>
                <Button variant="contained" sx={classes.button} onClick={() => handleOpenGuardianModal()}>
                  Add Guardian
                </Button>
              </Box>
              {guardians.length === 0 ? (
                <Typography sx={{ color: "var(--color-muted)" }}>No guardians linked yet.</Typography>
              ) : (
                <DataGrid
                  rows={guardians}
                  columns={[
                    {
                      field: "full_name",
                      headerName: "Guardian",
                      flex: 1,
                      minWidth: 180,
                      valueGetter: (value, row) =>
                        row?.full_name || [row?.first_name, row?.last_name].filter(Boolean).join(" ") || "—",
                    },
                    {
                      field: "is_primary_guardian",
                      headerName: "Primary",
                      width: 110,
                      valueGetter: (value, row) => (row?.is_primary_guardian ? "Yes" : "No"),
                    },
                    {
                      field: "email",
                      headerName: "Email",
                      flex: 1,
                      minWidth: 200,
                      valueGetter: (value, row) => row?.email || "—",
                    },
                    {
                      field: "phone",
                      headerName: "Phone",
                      minWidth: 160,
                      valueGetter: (value, row) => row?.phone || "—",
                    },
                    {
                      field: "athlete_count",
                      headerName: "Athletes",
                      width: 100,
                      valueGetter: (value, row) => row?.athlete_count ?? 0,
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
                            { label: "Edit", onClick: () => handleOpenGuardianModal(params.row) },
                          ]}
                        />
                      ),
                    },
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

            <Divider sx={{ borderColor: "var(--color-border)" }} />

            <Box sx={{ paddingTop: "8px" }}>
              <Typography sx={{ fontWeight: 600, color: "var(--color-text)", marginBottom: "8px" }}>Athletes</Typography>
              {athletes.length === 0 ? (
                <Typography sx={{ color: "var(--color-muted)" }}>No athletes linked yet.</Typography>
              ) : (
                <DataGrid
                  rows={athletes}
                  columns={[
                    {
                      field: "athlete_name",
                      headerName: "Athlete",
                      flex: 1,
                      minWidth: 180,
                      valueGetter: (value, row) =>
                        [row?.first_name, row?.last_name].filter(Boolean).join(" ") || "—",
                    },
                    {
                      field: "active_team_names",
                      headerName: "Active teams",
                      flex: 1,
                      minWidth: 220,
                      valueGetter: (value, row) => row?.active_team_names || "—",
                    },
                    {
                      field: "primary_email",
                      headerName: "Email",
                      flex: 1,
                      minWidth: 200,
                      valueGetter: (value, row) => row?.primary_email || "—",
                    },
                    {
                      field: "current_event_name",
                      headerName: "Current program",
                      flex: 1,
                      minWidth: 220,
                      valueGetter: (value, row) => row?.current_event_name || "—",
                    },
                    {
                      field: "instructors",
                      headerName: "Instructors",
                      flex: 1,
                      minWidth: 220,
                      valueGetter: (value, row) => row?.instructors || "—",
                    },
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
          </>
        )}
      </Box>

      <Dialog
        open={guardianModalOpen}
        onClose={handleCloseGuardianModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: "var(--color-surface)", color: "var(--color-text)" } }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
          {editingGuardianId ? "Edit Guardian" : "Add Guardian"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: "12px" }}>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="First name"
              value={guardianDraft.firstName}
              onChange={(event) => setGuardianDraft((prev) => ({ ...prev, firstName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              label="Last name"
              value={guardianDraft.lastName}
              onChange={(event) => setGuardianDraft((prev) => ({ ...prev, lastName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
          </Box>
          <TextField
            label="Full name"
            value={guardianDraft.fullName}
            onChange={(event) => setGuardianDraft((prev) => ({ ...prev, fullName: event.target.value }))}
            sx={classes.input}
          />
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Email"
              value={guardianDraft.email}
              onChange={(event) => setGuardianDraft((prev) => ({ ...prev, email: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
            <TextField
              label="Phone"
              value={guardianDraft.phone}
              onChange={(event) => setGuardianDraft((prev) => ({ ...prev, phone: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              select
              label="Status"
              value={guardianDraft.status}
              onChange={(event) => setGuardianDraft((prev) => ({ ...prev, status: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={guardianDraft.isPrimaryGuardian}
                  onChange={(event) =>
                    setGuardianDraft((prev) => ({ ...prev, isPrimaryGuardian: event.target.checked }))
                  }
                />
              }
              label="Primary guardian"
            />
          </Box>
          <TextField
            label="Notes"
            value={guardianDraft.notes}
            onChange={(event) => setGuardianDraft((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleCloseGuardianModal}>
            Cancel
          </Button>
          <Button variant="contained" sx={classes.button} onClick={handleSaveGuardian}>
            {editingGuardianId ? "Save Guardian" : "Add Guardian"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
