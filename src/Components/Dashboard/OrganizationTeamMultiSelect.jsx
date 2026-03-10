import React from "react";
import { Autocomplete, Box, Checkbox, TextField, Typography } from "@mui/material";

export default function OrganizationTeamMultiSelect({
  classes,
  label = "Teams",
  minWidth = "260px",
  organizationOptions = [],
  teamsByOrganization = {},
  selectedTeamIds = [],
  onSelectedTeamIdsChange = () => {},
}) {
  const allTeamIds = Object.values(teamsByOrganization).flat().map((team) => String(team.id));
  const allSelected =
    allTeamIds.length > 0 && allTeamIds.every((teamId) => selectedTeamIds.includes(teamId));
  const selectAllOption = {
    id: "__all__",
    name: allSelected ? "Clear all" : "Select all",
    _isSelectAll: true,
  };
  const optionsWithSelectAll = [selectAllOption, ...organizationOptions];
  const selectedCount = selectedTeamIds.length;

  const toggleTeams = (teamIds, shouldSelect) => {
    if (teamIds.length === 0) return;
    const next = shouldSelect
      ? Array.from(new Set([...selectedTeamIds, ...teamIds]))
      : selectedTeamIds.filter((id) => !teamIds.includes(id));
    onSelectedTeamIdsChange(next);
  };

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      disablePortal
      options={optionsWithSelectAll}
      onChange={(_event, _value, _reason, details) => {
        const option = details?.option;
        if (!option) return;
        if (option?._isSelectAll) {
          onSelectedTeamIdsChange(allSelected ? [] : allTeamIds);
          return;
        }
        const orgId = String(option.id);
        const orgTeams = teamsByOrganization[orgId] || [];
        const orgTeamIds = orgTeams.map((team) => String(team.id));
        const orgSelectedCount = orgTeamIds.filter((id) => selectedTeamIds.includes(id)).length;
        const orgSelected = orgTeamIds.length > 0 && orgSelectedCount === orgTeamIds.length;
        toggleTeams(orgTeamIds, !orgSelected);
      }}
      getOptionLabel={(option) => option?.name || ""}
      isOptionEqualToValue={(option, value) => String(option.id) === String(value.id)}
      renderTags={() => (selectedCount > 0 ? <span>{selectedCount} teams selected</span> : null)}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--color-surface-2, #151c27)",
            color: "var(--color-text, #f7f9fc)",
            border: "1px solid var(--color-border, rgba(255, 255, 255, 0.08))",
            boxShadow: "var(--shadow-soft, 0 18px 30px rgba(0,0,0,0.28))",
          },
        },
        listbox: {
          sx: {
            padding: "4px 0",
            backgroundColor: "var(--color-surface-2, #151c27)",
            color: "var(--color-text, #f7f9fc)",
          },
        },
        popper: {
          sx: {
            zIndex: 1400,
          },
        },
      }}
      sx={{
        "& .MuiAutocomplete-option": {
          alignItems: "flex-start",
          paddingTop: "8px",
          paddingBottom: "8px",
          "&[aria-selected='true']": {
            backgroundColor: "rgba(215, 38, 56, 0.14)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(215, 38, 56, 0.14)",
          },
        },
        "& .MuiAutocomplete-tag": {
          backgroundColor: "var(--color-surface-3, #1b2430)",
          color: "var(--color-text, #f7f9fc)",
          border: "1px solid var(--color-border, rgba(255, 255, 255, 0.08))",
        },
        "& .MuiChip-label": { color: "var(--color-text, #f7f9fc)" },
      }}
      renderOption={(props, option, { selected }) => {
        if (option?._isSelectAll) {
          return (
            <li {...props}>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={!allSelected && selectedCount > 0}
                  sx={{
                    color: "var(--color-muted, #a9b4c3)",
                    "&.Mui-checked": { color: "var(--color-accent, #d72638)" },
                    marginRight: "8px",
                  }}
                />
                <Typography sx={{ color: "var(--color-text, #f7f9fc)", fontWeight: 600 }}>
                  {option.name}
                </Typography>
              </Box>
            </li>
          );
        }
        const orgId = String(option.id);
        const orgTeams = teamsByOrganization[orgId] || [];
        const orgTeamIds = orgTeams.map((team) => String(team.id));
        const orgSelectedCount = orgTeamIds.filter((id) => selectedTeamIds.includes(id)).length;
        const orgSelected = orgTeamIds.length > 0 && orgSelectedCount === orgTeamIds.length;
        const orgIndeterminate = orgSelectedCount > 0 && orgSelectedCount < orgTeamIds.length;
        return (
          <li {...props}>
            <Box sx={{ display: "grid", gap: "4px", width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={orgSelected}
                  indeterminate={orgIndeterminate}
                  onChange={(event) => {
                    event.stopPropagation();
                    toggleTeams(orgTeamIds, !orgSelected);
                  }}
                  sx={{
                    color: "var(--color-muted, #a9b4c3)",
                    "&.Mui-checked": { color: "var(--color-accent, #d72638)" },
                    marginRight: "8px",
                  }}
                />
                <Typography sx={{ color: "var(--color-text, #f7f9fc)" }}>{option.name}</Typography>
              </Box>
              {orgTeams.length > 0 && (
                <Box
                  sx={{ paddingLeft: "36px", display: "grid", gap: "2px" }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  {orgTeams.map((team) => {
                    const teamId = String(team.id);
                    const checked = selectedTeamIds.includes(teamId);
                    return (
                      <Box key={teamId} sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={checked}
                          onChange={(event) => {
                            event.stopPropagation();
                            toggleTeams([teamId], !checked);
                          }}
                          onMouseDown={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }}
                          onClick={(event) => event.stopPropagation()}
                          sx={{
                            color: "var(--color-muted, #a9b4c3)",
                            "&.Mui-checked": { color: "var(--color-accent, #d72638)" },
                            marginRight: "6px",
                          }}
                        />
                        <Typography sx={{ color: "var(--color-muted, #a9b4c3)", fontSize: "0.82rem" }}>
                          {team.name}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{ ...classes.input, minWidth }}
        />
      )}
    />
  );
}
