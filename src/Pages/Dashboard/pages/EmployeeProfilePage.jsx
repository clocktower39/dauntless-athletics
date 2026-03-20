import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { emptyEmployee } from "../dashboardConstants";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setEmployees, setOrganizations } from "../../../store/dashboardSlice";

export default function EmployeeProfilePage() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const employees = useSelector((state) => state.dashboard.employees);
  const [dataError, setDataError] = useState("");
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(employeeId === "new" || startEdit ? "edit" : "view");
  const [employeeDraft, setEmployeeDraft] = useState(emptyEmployee);

  const authHeaders = useMemo(() => authHeader(token), [token]);
  const employeeIdNumber = Number(employeeId);
  const isNew = employeeId === "new";

  const employee = useMemo(() => {
    if (isNew) return null;
    return employees.find((item) => Number(item.id) === employeeIdNumber) || null;
  }, [employees, employeeIdNumber, isNew]);

  const organizationMap = useMemo(
    () => new Map(organizations.map((org) => [String(org.org_id || org.id), org.name])),
    [organizations]
  );

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const [employeeRes, orgRes] = await Promise.all([
          apiRequest("/api/admin/employees", { headers: authHeaders }),
          apiRequest("/api/admin/organizations", { headers: authHeaders }),
        ]);
        dispatch(setEmployees(employeeRes.employees || []));
        dispatch(setOrganizations(orgRes.organizations || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (isNew) {
      setEmployeeDraft(emptyEmployee);
      setMode("edit");
      return;
    }

    if (employee) {
      setEmployeeDraft({
        organizationId: employee.org_id ? String(employee.org_id) : "",
        firstName: employee.first_name || "",
        lastName: employee.last_name || "",
        preferredName: employee.preferred_name || "",
        title: employee.title || "",
        department: employee.department || "",
        employmentType: employee.employment_type || "contractor",
        email: employee.email || "",
        phone: employee.phone || "",
        status: employee.status || "active",
        startDate: employee.start_date ? String(employee.start_date).slice(0, 10) : "",
        endDate: employee.end_date ? String(employee.end_date).slice(0, 10) : "",
        notes: employee.notes || "",
      });
    }
  }, [employee, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const handleSave = async () => {
    if (!employeeDraft.firstName.trim() || !employeeDraft.lastName.trim()) {
      setDataError("First and last name are required.");
      return;
    }

    try {
      setDataError("");
      const payload = {
        org_id: employeeDraft.organizationId || null,
        first_name: employeeDraft.firstName.trim(),
        last_name: employeeDraft.lastName.trim(),
        preferred_name: employeeDraft.preferredName.trim(),
        title: employeeDraft.title.trim(),
        department: employeeDraft.department.trim(),
        employment_type: employeeDraft.employmentType,
        email: employeeDraft.email.trim(),
        phone: employeeDraft.phone.trim(),
        status: employeeDraft.status,
        start_date: employeeDraft.startDate || null,
        end_date: employeeDraft.endDate || null,
        notes: employeeDraft.notes.trim(),
      };

      let savedId = employeeIdNumber;
      if (isNew) {
        const result = await apiRequest("/api/admin/employees", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
        savedId = result.employee?.id;
      } else {
        await apiRequest(`/api/admin/employees/${employeeIdNumber}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(payload),
        });
      }

      const refreshed = await apiRequest("/api/admin/employees", { headers: authHeaders });
      dispatch(setEmployees(refreshed.employees || []));
      if (savedId) {
        navigate(`/dashboard/employees/${savedId}`);
      }
      setMode("view");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!employeeIdNumber) return;
    try {
      setDataError("");
      await apiRequest(`/api/admin/employees/${employeeIdNumber}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/employees", { headers: authHeaders });
      dispatch(setEmployees(refreshed.employees || []));
      navigate("/dashboard/employees");
    } catch (error) {
      setDataError(error.message);
    }
  };

  const employeeName =
    employeeDraft.preferredName ||
    [employeeDraft.firstName, employeeDraft.lastName].filter(Boolean).join(" ") ||
    "Employee";

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}

      <Box sx={classes.section}>
        <Box sx={classes.workspaceHeader}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)" }}>
              {isNew ? "New Employee" : employeeName}
            </Typography>
            <Typography sx={classes.breadcrumb}>Dashboard / Employees / Profile</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={() => navigate("/dashboard/employees")}>
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

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Overview</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" }, gap: "12px" }}>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Title</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {employeeDraft.title || "—"}
              </Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Department</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {employeeDraft.department || "—"}
              </Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Type</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {employeeDraft.employmentType || "—"}
              </Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Status</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {employeeDraft.status || "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "840px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Details</Typography>
          <TextField
            select
            label="Organization"
            value={employeeDraft.organizationId}
            onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, organizationId: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          >
            <MenuItem value="">Default organization</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.id} value={String(org.org_id || org.id)}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="First name"
              value={employeeDraft.firstName}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, firstName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Last name"
              value={employeeDraft.lastName}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, lastName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Preferred name"
              value={employeeDraft.preferredName}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, preferredName: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Title"
              value={employeeDraft.title}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, title: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Department"
              value={employeeDraft.department}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, department: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              select
              label="Employment type"
              value={employeeDraft.employmentType}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, employmentType: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            >
              <MenuItem value="full-time">Full-time</MenuItem>
              <MenuItem value="part-time">Part-time</MenuItem>
              <MenuItem value="contractor">Contractor</MenuItem>
              <MenuItem value="seasonal">Seasonal</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              label="Email"
              value={employeeDraft.email}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, email: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              label="Phone"
              value={employeeDraft.phone}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, phone: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            />
            <TextField
              select
              label="Status"
              value={employeeDraft.status}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, status: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <TextField
              type="date"
              label="Start date"
              value={employeeDraft.startDate}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, startDate: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
              disabled={mode === "view"}
            />
            <TextField
              type="date"
              label="End date"
              value={employeeDraft.endDate}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, endDate: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              InputLabelProps={{ shrink: true }}
              disabled={mode === "view"}
            />
          </Box>
          <TextField
            label="Notes"
            value={employeeDraft.notes}
            onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            multiline
            minRows={3}
            disabled={mode === "view"}
          />
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "8px", paddingTop: "8px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Assignment</Typography>
          <Box sx={classes.statCard}>
            <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Organization</Typography>
            <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
              {organizationMap.get(String(employeeDraft.organizationId)) || "Dauntless Athletics"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
