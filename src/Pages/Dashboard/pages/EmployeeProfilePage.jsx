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
import { emptyEmployee, emptyEmployeeRole } from "../dashboardConstants";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setEmployees } from "../../../store/dashboardSlice";

const employmentTypeOptions = ["full-time", "part-time", "contractor", "seasonal", "other"];
const roleStatusOptions = ["active", "inactive", "ended"];

const createEmptyRole = () => ({ ...emptyEmployeeRole });

export default function EmployeeProfilePage() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = useSelector((state) => state.auth.token);
  const employees = useSelector((state) => state.dashboard.employees);
  const [dataError, setDataError] = useState("");
  const startEdit = searchParams.get("edit") === "1";
  const [mode, setMode] = useState(employeeId === "new" || startEdit ? "edit" : "view");
  const [employeeDraft, setEmployeeDraft] = useState({ ...emptyEmployee, roles: [createEmptyRole()] });

  const authHeaders = useMemo(() => authHeader(token), [token]);
  const employeeIdNumber = Number(employeeId);
  const isNew = employeeId === "new";

  const employee = useMemo(() => {
    if (isNew) return null;
    return employees.find((item) => Number(item.id) === employeeIdNumber) || null;
  }, [employees, employeeIdNumber, isNew]);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        setDataError("");
        const employeeRes = await apiRequest("/api/admin/employees", { headers: authHeaders });
        dispatch(setEmployees(employeeRes.employees || []));
      } catch (error) {
        setDataError(error.message);
      }
    };
    load();
  }, [token, authHeaders, dispatch]);

  useEffect(() => {
    if (isNew) {
      setEmployeeDraft({ ...emptyEmployee, roles: [createEmptyRole()] });
      setMode("edit");
      return;
    }

    if (employee) {
      setEmployeeDraft({
        firstName: employee.first_name || "",
        lastName: employee.last_name || "",
        preferredName: employee.preferred_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        status: employee.status || "active",
        notes: employee.notes || "",
        roles:
          Array.isArray(employee.roles) && employee.roles.length > 0
            ? employee.roles.map((role) => ({
                id: role.id,
                title: role.title || "",
                department: role.department || "",
                employmentType: role.employment_type || "contractor",
                status: role.status || "active",
                startDate: role.start_date ? String(role.start_date).slice(0, 10) : "",
                endDate: role.end_date ? String(role.end_date).slice(0, 10) : "",
                notes: role.notes || "",
              }))
            : [createEmptyRole()],
      });
    }
  }, [employee, isNew]);

  useEffect(() => {
    if (startEdit) {
      setMode("edit");
    }
  }, [startEdit]);

  const employeeName =
    employeeDraft.preferredName ||
    [employeeDraft.firstName, employeeDraft.lastName].filter(Boolean).join(" ") ||
    "Employee";

  const activeRoles = employeeDraft.roles.filter((role) => (role.status || "active") === "active");
  const titleSummary = employeeDraft.roles.map((role) => role.title).filter(Boolean).join(", ") || "—";
  const workTypes = [...new Set(employeeDraft.roles.map((role) => role.employmentType).filter(Boolean))].join(", ") || "—";

  const handleRoleChange = (index, field, value) => {
    setEmployeeDraft((prev) => ({
      ...prev,
      roles: prev.roles.map((role, roleIndex) =>
        roleIndex === index ? { ...role, [field]: value } : role
      ),
    }));
  };

  const handleAddRole = () => {
    setEmployeeDraft((prev) => ({
      ...prev,
      roles: [...prev.roles, createEmptyRole()],
    }));
  };

  const handleRemoveRole = (index) => {
    setEmployeeDraft((prev) => {
      const nextRoles = prev.roles.filter((_, roleIndex) => roleIndex !== index);
      return {
        ...prev,
        roles: nextRoles.length > 0 ? nextRoles : [createEmptyRole()],
      };
    });
  };

  const handleSave = async () => {
    if (!employeeDraft.firstName.trim() || !employeeDraft.lastName.trim()) {
      setDataError("First and last name are required.");
      return;
    }

    const normalizedRoles = employeeDraft.roles
      .map((role) => ({
        title: role.title.trim(),
        department: role.department.trim(),
        employment_type: role.employmentType,
        status: role.status,
        start_date: role.startDate || null,
        end_date: role.endDate || null,
        notes: role.notes.trim(),
      }))
      .filter((role) => role.title);

    if (normalizedRoles.length === 0) {
      setDataError("Add at least one assignment with a title.");
      return;
    }

    try {
      setDataError("");
      const payload = {
        first_name: employeeDraft.firstName.trim(),
        last_name: employeeDraft.lastName.trim(),
        preferred_name: employeeDraft.preferredName.trim(),
        email: employeeDraft.email.trim(),
        phone: employeeDraft.phone.trim(),
        status: employeeDraft.status,
        notes: employeeDraft.notes.trim(),
        roles: normalizedRoles,
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
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Assignments</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{titleSummary}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Active Roles</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{activeRoles.length}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Work Types</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>{workTypes}</Typography>
            </Box>
            <Box sx={classes.statCard}>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>Employee Status</Typography>
              <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                {employeeDraft.status || "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px", maxWidth: "900px" }}>
          <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Person Details</Typography>
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
              label="Email"
              value={employeeDraft.email}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, email: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "220px" }}
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
              label="Employee status"
              value={employeeDraft.status}
              onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, status: event.target.value }))}
              sx={{ ...classes.input, flex: 1, minWidth: "180px" }}
              disabled={mode === "view"}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
          <TextField
            label="Notes"
            multiline
            minRows={4}
            value={employeeDraft.notes}
            onChange={(event) => setEmployeeDraft((prev) => ({ ...prev, notes: event.target.value }))}
            sx={classes.input}
            disabled={mode === "view"}
          />
        </Box>

        <Divider sx={{ borderColor: "var(--color-border)" }} />

        <Box sx={{ display: "grid", gap: "12px", paddingTop: "8px" }}>
          <Box sx={classes.workspaceHeader}>
            <Box>
              <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Assignments</Typography>
              <Typography sx={{ color: "var(--color-muted)", fontSize: "0.82rem" }}>
                Track every role this employee holds at Dauntless.
              </Typography>
            </Box>
            {mode === "edit" && (
              <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={handleAddRole}>
                Add Assignment
              </Button>
            )}
          </Box>

          <Box sx={{ display: "grid", gap: "12px" }}>
            {employeeDraft.roles.map((role, index) => (
              <Box key={role.id || `role-${index}`} sx={classes.statCard}>
                <Box sx={classes.workspaceHeader}>
                  <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                    {role.title || `Assignment ${index + 1}`}
                  </Typography>
                  {mode === "edit" && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => handleRemoveRole(index)}
                      disabled={employeeDraft.roles.length === 1}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: "grid", gap: "12px", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" } }}>
                  <TextField
                    label="Title"
                    value={role.title}
                    onChange={(event) => handleRoleChange(index, "title", event.target.value)}
                    sx={classes.input}
                    disabled={mode === "view"}
                  />
                  <TextField
                    label="Department"
                    value={role.department}
                    onChange={(event) => handleRoleChange(index, "department", event.target.value)}
                    sx={classes.input}
                    disabled={mode === "view"}
                  />
                  <TextField
                    select
                    label="Work type"
                    value={role.employmentType}
                    onChange={(event) => handleRoleChange(index, "employmentType", event.target.value)}
                    sx={classes.input}
                    disabled={mode === "view"}
                  >
                    {employmentTypeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Assignment status"
                    value={role.status}
                    onChange={(event) => handleRoleChange(index, "status", event.target.value)}
                    sx={classes.input}
                    disabled={mode === "view"}
                  >
                    {roleStatusOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="date"
                    label="Start date"
                    value={role.startDate}
                    onChange={(event) => handleRoleChange(index, "startDate", event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={classes.input}
                    disabled={mode === "view"}
                  />
                  <TextField
                    type="date"
                    label="End date"
                    value={role.endDate}
                    onChange={(event) => handleRoleChange(index, "endDate", event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={classes.input}
                    disabled={mode === "view"}
                  />
                </Box>
                <TextField
                  label="Assignment notes"
                  multiline
                  minRows={3}
                  value={role.notes}
                  onChange={(event) => handleRoleChange(index, "notes", event.target.value)}
                  sx={classes.input}
                  disabled={mode === "view"}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
