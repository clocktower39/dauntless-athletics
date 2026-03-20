import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router";
import {
  Alert,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useDispatch, useSelector } from "react-redux";
import DashboardNav from "../../Components/Dashboard/DashboardNav";
import classes from "./dashboardStyles";
import { TOKEN_KEY, drawerWidth } from "./dashboardConstants";
import { apiRequest } from "./surveyApi";
import { clearToken, setAuthError, setAuthLoading, setToken } from "../../store/authSlice";
import DauntlessAthleticsLogoDesktopCircleImg from "../../assets/Dauntless-Athletics-Logo-Desktop-Circle1.png";

export default function AdminDashboard() {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const authLoading = useSelector((state) => state.auth.loading);
  const loginError = useSelector((state) => state.auth.error);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });

  const activeSection = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (parts[0] !== "dashboard") return "overview";
    return parts[1] || "overview";
  }, [location.pathname]);

  const basePath = "/dashboard";

  const navItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: <DashboardOutlinedIcon /> },
      { id: "organizations", label: "Organizations", icon: <BusinessIcon /> },
      { id: "families", label: "Families", icon: <PeopleAltOutlinedIcon /> },
      { id: "employees", label: "Employees", icon: <BadgeOutlinedIcon /> },
      { id: "teams", label: "Teams", icon: <EventNoteIcon /> },
      { id: "people", label: "People", icon: <ContactsIcon /> },
      { id: "surveys", label: "Surveys", icon: <AssignmentOutlinedIcon /> },
    ],
    []
  );

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(""));
    try {
      const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      if (result.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }
      localStorage.setItem(TOKEN_KEY, result.token);
      dispatch(setToken(result.token));
      setLogin({ username: "", password: "" });
    } catch (error) {
      dispatch(setAuthError(error.message));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    dispatch(clearToken());
  };

  const drawer = (
    <DashboardNav
      token={token}
      navItems={navItems}
      activeSection={activeSection}
      basePath={basePath}
      onNavigate={() => setMobileOpen(false)}
      onLogout={handleLogout}
      logoSrc={DauntlessAthleticsLogoDesktopCircleImg}
    />
  );

  return (
    <Box sx={classes.page}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="Dashboard navigation">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, ...classes.drawer }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, ...classes.drawer }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box sx={classes.content}>
        <Container maxWidth="xl" sx={classes.shell}>
          {token && (
            <Box sx={{ display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
              <IconButton onClick={handleDrawerToggle} sx={{ color: "var(--color-text)" }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          {!token ? (
            <Box component="form" onSubmit={handleLogin} sx={classes.section}>
              <Typography sx={{ fontWeight: 600, color: "var(--color-text)" }}>Admin Login</Typography>
              <TextField
                label="Username"
                value={login.username}
                onChange={(event) => setLogin((prev) => ({ ...prev, username: event.target.value }))}
                sx={classes.input}
              />
              <TextField
                label="Password"
                type="password"
                value={login.password}
                onChange={(event) => setLogin((prev) => ({ ...prev, password: event.target.value }))}
                sx={classes.input}
              />
              {loginError && <Alert severity="error">{loginError}</Alert>}
              <Button type="submit" variant="contained" sx={classes.button} disabled={authLoading}>
                {authLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          ) : (
            <Outlet />
          )}
        </Container>
      </Box>
    </Box>
  );
}
