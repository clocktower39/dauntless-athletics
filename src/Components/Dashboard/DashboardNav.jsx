import React from "react";
import { Link } from "react-router";
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export default function DashboardNav({
  token,
  navItems,
  activeSection,
  basePath,
  onNavigate,
  onLogout,
  logoSrc,
}) {
  return (
    <Box sx={{ display: "grid", gap: "16px", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar
          src={logoSrc}
          alt="Dauntless Athletics Logo"
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography sx={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
            Client Management
          </Typography>
          <Typography sx={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
            Dauntless Athletics
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "var(--color-border)" }} />
      {token ? (
        <List dense sx={{ display: "grid", gap: "6px" }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.id}
              component={Link}
              to={`${basePath}/${item.id}`}
              onClick={onNavigate}
              selected={activeSection === item.id}
              sx={{
                borderRadius: "12px",
                color: "var(--color-text)",
                paddingY: "10px",
                "&.Mui-selected": {
                  backgroundColor: "rgba(215, 38, 56, 0.18)",
                  border: "1px solid rgba(215, 38, 56, 0.35)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(215, 38, 56, 0.22)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: "inherit",
                  opacity: activeSection === item.id ? 1 : 0.7,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.95rem", fontWeight: 500 }}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography sx={{ color: "var(--color-muted)" }}>Sign in to access admin tools.</Typography>
      )}
      <Box sx={{ marginTop: "auto", display: "grid", gap: "8px" }}>
        {token && (
          <Button
            variant="outlined"
            size="small"
            onClick={onLogout}
            sx={{ color: "var(--color-text)", borderColor: "var(--color-border)", textTransform: "none" }}
          >
            Log out
          </Button>
        )}
      </Box>
    </Box>
  );
}
