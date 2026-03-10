import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

const colors = {
  bg: "#0b0d10",
  surface: "#121822",
  surface2: "#151c27",
  surface3: "#1b2430",
  accent: "#d72638",
  accent2: "#c21f31",
  text: "#f7f9fc",
  muted: "#a9b4c3",
  border: "rgba(255, 255, 255, 0.08)",
};

const appTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: colors.accent },
    secondary: { main: colors.accent2 },
    background: {
      default: colors.bg,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
      secondary: colors.muted,
    },
    divider: colors.border,
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "var(--font-body)",
    h1: { fontFamily: "var(--font-display)" },
    h2: { fontFamily: "var(--font-display)" },
    h3: { fontFamily: "var(--font-display)" },
    h4: { fontFamily: "var(--font-display)" },
    h5: { fontFamily: "var(--font-display)" },
    h6: { fontFamily: "var(--font-display)" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: colors.surface2,
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface3,
          color: colors.text,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.border,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.accent,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.accent,
          },
        },
        input: {
          color: colors.text,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.muted,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.border,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          backgroundColor: colors.surface2,
          color: colors.text,
        },
        columnHeaders: {
          backgroundColor: colors.surface3,
          color: colors.text,
          textTransform: "uppercase",
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          borderBottom: `1px solid ${colors.border}`,
        },
        cell: {
          borderBottom: `1px solid ${colors.border}`,
        },
        footerContainer: {
          borderTop: `1px solid ${colors.border}`,
          backgroundColor: colors.surface3,
          color: colors.muted,
        },
        toolbarContainer: {
          padding: "8px 12px",
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.surface3,
        },
      },
    },
  },
});

export default appTheme;
