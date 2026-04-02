import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EmployeesSection from "../../../Components/Dashboard/EmployeesSection";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setEmployees } from "../../../store/dashboardSlice";

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const employees = useSelector((state) => state.dashboard.employees);
  const [dataError, setDataError] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const authHeaders = useMemo(() => authHeader(token), [token]);

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

  const filteredEmployees = useMemo(() => {
    let items = [...employees];
    const term = employeeSearch.trim().toLowerCase();

    if (statusFilter !== "all") {
      items = items.filter((employee) => (employee.status || "active") === statusFilter);
    }
    if (!term) return items;

    return items.filter((employee) =>
      [
        employee.first_name,
        employee.last_name,
        employee.preferred_name,
        employee.title_summary,
        employee.department_summary,
        ...(employee.roles || []).flatMap((role) => [role.title, role.department, role.employment_type]),
        employee.email,
        employee.phone,
      ].some((field) => String(field || "").toLowerCase().includes(term))
    );
  }, [employees, employeeSearch, statusFilter]);

  const handleDeleteEmployee = async (employeeId) => {
    try {
      setDataError("");
      await apiRequest(`/api/admin/employees/${employeeId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const refreshed = await apiRequest("/api/admin/employees", { headers: authHeaders });
      dispatch(setEmployees(refreshed.employees || []));
    } catch (error) {
      setDataError(error.message);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: "16px" }}>
      {dataError && <Alert severity="error">{dataError}</Alert>}
      <EmployeesSection
        classes={classes}
        employeeSearch={employeeSearch}
        onEmployeeSearchChange={setEmployeeSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        employees={filteredEmployees}
        onAddEmployee={() => navigate("/dashboard/employees/new")}
        onEditEmployee={(employee) => navigate(`/dashboard/employees/${employee.id}?edit=1`)}
        onDeleteEmployee={handleDeleteEmployee}
      />
    </Box>
  );
}
