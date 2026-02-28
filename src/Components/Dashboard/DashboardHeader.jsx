import React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function DashboardHeader({
  token,
  activeLabel,
  headerMetaItems,
  kpiStats,
  onMenuToggle,
  classes,
  logoSrc,
}) {
  return (
    <Paper sx={classes.headerCard}>
      <Box sx={classes.headerTop}>
        <Box sx={classes.headerTitle}>
          {token && onMenuToggle && (
            <IconButton
              onClick={onMenuToggle}
              sx={{ display: { xs: "inline-flex", md: "none" }, color: "var(--color-text)" }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Avatar
            src={logoSrc}
            alt="Dauntless Athletics Logo"
            sx={{ width: 48, height: 48 }}
          />
          <Box>
            <Typography sx={{ fontWeight: 700, color: "var(--color-text)", fontSize: "1.3rem" }}>
              Client Management
            </Typography>
            <Typography sx={{ color: "var(--color-muted)" }}>
              {token ? `${activeLabel} Dashboard` : "Sign in to continue"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography sx={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
        Internal workspace for managing client relationships, team schedules, and survey operations.
      </Typography>
      {token && (
        <>
          <Divider sx={{ borderColor: "var(--color-border)" }} />
          <Box sx={classes.headerMeta}>
            {headerMetaItems.map((item) => (
              <Box key={item.label} sx={classes.headerMetaItem}>
                <Typography sx={{ color: "var(--color-muted)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {item.label}
                </Typography>
                <Typography sx={{ color: "var(--color-text)", fontWeight: 600 }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={classes.kpiRow}>
            {kpiStats.map((stat) => (
              <Box key={stat.label} sx={classes.kpiCard}>
                <Typography sx={classes.kpiLabel}>{stat.label}</Typography>
                <Typography sx={classes.kpiValue}>{stat.value}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
}
