import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EmployeesSection from "../../../Components/Dashboard/EmployeesSection";
import classes from "../dashboardStyles";
import { apiRequest, authHeader } from "../surveyApi";
import { setEmployees, setOrganizations } from "../../../store/dashboardSlice";

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const organizations = useSelector((state) => state.dashboard.organizations);
  const employees = useSelector((state) => state.dashboard.employees);
  const [dataError, setDataError] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const authHeaders = useMemo(() => authHeader(token), [token]);

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

  const filteredEmployees = useMemo(() => {
    let items = [...employees];
    const term = employeeSearch.trim().toLowerCase();

    if (organizationFilter !== "all") {
      items = items.filter((employee) => String(employee.org_id) === organizationFilter);
    }
    if (statusFilter !== "all") {
      items = items.filter((employee) => (employee.status || "active") === statusFilter);
    }
    if (!term) return items;

    return items.filter((employee) =>
      [
        employee.first_name,
        employee.last_name,
        employee.preferred_name,
        employee.title,
        employee.department,
        employee.email,
        employee.phone,
        employee.organization_name,
      ].some((field) => String(field || "").toLowerCase().includes(term))
    );
  }, [employees, employeeSearch, organizationFilter, statusFilter]);

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
        organizationFilter={organizationFilter}
        onOrganizationFilterChange={setOrganizationFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        organizations={organizations}
        employees={filteredEmployees}
        onAddEmployee={() => navigate("/dashboard/employees/new")}
        onEditEmployee={(employee) => navigate(`/dashboard/employees/${employee.id}?edit=1`)}
        onDeleteEmployee={handleDeleteEmployee}
      />
    </Box>
  );
}
