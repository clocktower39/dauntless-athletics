import React, { useMemo, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function RowActionsMenu({ actions = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const safeActions = useMemo(
    () => actions.filter((action) => action && typeof action.label === "string"),
    [actions]
  );

  const handleOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen} sx={{ color: "var(--color-text)" }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { backgroundColor: "var(--color-surface-2)", color: "var(--color-text)" } }}
      >
        {safeActions.map((action) => (
          <MenuItem
            key={action.label}
            disabled={action.disabled}
            onClick={(event) => {
              event.stopPropagation();
              handleClose(event);
              action.onClick?.();
            }}
            sx={action.color === "danger" ? { color: "var(--color-accent)" } : undefined}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
