import React from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

export default function OrganizationDrawer({
  open,
  onClose,
  classes,
  orgDrawerMode,
  orgDraft,
  onDraftChange,
  organizationTypeOptions,
  districts,
  readOnly,
  onSave,
  onEdit,
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: classes.drawerPaper }}
    >
      <Box sx={{ display: "grid", gap: "16px", padding: "20px", height: "100%" }}>
        <Box>
          <Typography sx={classes.breadcrumb}>Organizations</Typography>
          <Typography sx={{ fontWeight: 700, color: "var(--color-text)", fontSize: "1.2rem" }}>
            {orgDrawerMode === "create"
              ? "New Organization"
              : orgDrawerMode === "edit"
              ? "Edit Organization"
              : "Organization Details"}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "var(--color-border)" }} />
        <TextField
          label="Organization name"
          value={orgDraft.name}
          onChange={(event) => onDraftChange((prev) => ({ ...prev, name: event.target.value }))}
          sx={classes.input}
          disabled={readOnly}
        />
        <TextField
          select
          label="Type"
          value={orgDraft.type}
          onChange={(event) => onDraftChange((prev) => ({ ...prev, type: event.target.value }))}
          sx={classes.input}
          disabled={readOnly}
        >
          {organizationTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Parent organization"
          value={orgDraft.parentId}
          onChange={(event) => onDraftChange((prev) => ({ ...prev, parentId: event.target.value }))}
          sx={classes.input}
          disabled={readOnly}
        >
          <MenuItem value="">No parent</MenuItem>
          {districts.map((org) => (
            <MenuItem key={org.id} value={String(org.id)}>
              {org.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          value={orgDraft.status}
          onChange={(event) => onDraftChange((prev) => ({ ...prev, status: event.target.value }))}
          sx={classes.input}
          disabled={readOnly}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>

        <Box sx={{ marginTop: "auto", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          {readOnly ? (
            <>
              <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={onClose}>
                Close
              </Button>
              {orgDraft.id && (
                <Button variant="contained" sx={classes.button} onClick={onEdit}>
                  Edit
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outlined" sx={{ color: "var(--color-text)" }} onClick={onClose}>
                Cancel
              </Button>
              <Button variant="contained" sx={classes.button} onClick={onSave}>
                Save
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}
