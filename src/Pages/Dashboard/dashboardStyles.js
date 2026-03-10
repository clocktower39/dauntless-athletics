import { drawerWidth } from "./dashboardConstants";

const classes = {
  page: {
    minHeight: "100vh",
    padding: 0,
    display: "flex",
    background:
      "radial-gradient(circle at 15% 15%, rgba(215, 38, 56, 0.18), transparent 45%), linear-gradient(160deg, #0b1017 0%, #0d121a 40%, #0a0f16 100%)",
    "--color-text": "#f7f9fc",
    "--color-muted": "#a9b4c3",
    "--color-border": "rgba(255, 255, 255, 0.08)",
    "--color-surface": "#121822",
    "--color-surface-2": "#151c27",
    "--color-surface-3": "#1b2430",
    "--color-accent": "#d72638",
    "--color-accent-2": "#c21f31",
    "--shadow-soft": "0 18px 30px rgba(0,0,0,0.28)",
    "--shadow-strong": "0 28px 50px rgba(0,0,0,0.4)",
  },
  content: {
    flex: 1,
    padding: { xs: "18px 12px", md: "28px 24px" },
  },
  drawer: {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      backgroundColor: "rgba(12, 17, 24, 0.98)",
      color: "var(--color-text)",
      borderRight: "1px solid var(--color-border)",
      padding: "18px 16px",
      boxSizing: "border-box",
    },
  },
  shell: {
    display: "grid",
    gap: "16px",
  },
  headerCard: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: { xs: "16px", md: "20px 22px" },
    boxShadow: "var(--shadow-strong)",
    display: "grid",
    gap: "16px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: "\"\"",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: "linear-gradient(90deg, rgba(215,38,56,0.9), rgba(215,38,56,0.2), rgba(215,38,56,0))",
    },
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  headerMeta: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
  },
  headerMetaItem: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "10px 12px",
    display: "grid",
    gap: "4px",
  },
  kpiRow: {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(6, minmax(0, 1fr))" },
  },
  kpiCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "10px 12px",
    display: "grid",
    gap: "4px",
  },
  kpiLabel: {
    color: "var(--color-muted)",
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  kpiValue: {
    color: "var(--color-text)",
    fontSize: "1.2rem",
    fontWeight: 700,
  },
  section: {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: "18px",
    padding: "18px",
    display: "grid",
    gap: "12px",
    boxShadow: "var(--shadow-soft)",
  },
  input: {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface-3)",
      color: "var(--color-text)",
      borderRadius: "12px",
      "& fieldset": { borderColor: "var(--color-border)" },
      "&:hover fieldset": { borderColor: "var(--color-accent)" },
      "&.Mui-focused fieldset": { borderColor: "var(--color-accent)" },
    },
    "& .MuiInputLabel-root": { color: "var(--color-muted)" },
  },
  button: {
    backgroundColor: "var(--color-accent)",
    borderRadius: "999px",
    padding: "10px 24px",
    "&:hover": { backgroundColor: "var(--color-accent-2)" },
  },
  statCard: {
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "14px",
    padding: "12px 14px",
    display: "grid",
    gap: "4px",
  },
  tablePaper: {
    backgroundColor: "var(--color-surface-2)",
    borderRadius: "12px",
    border: "1px solid var(--color-border)",
  },
  tableHeadCell: {
    color: "var(--color-muted)",
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  dataGrid: {
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    backgroundColor: "var(--color-surface-2)",
    color: "var(--color-text)",
    "& .MuiDataGrid-main": {
      backgroundColor: "var(--color-surface-2)",
    },
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: "var(--color-surface-2)",
    },
    "& .MuiDataGrid-overlay": {
      backgroundColor: "var(--color-surface-2)",
      color: "var(--color-muted)",
    },
    "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeadersInner, & .MuiDataGrid-columnHeader": {
      backgroundColor: "var(--color-surface-3) !important",
      color: "var(--color-text)",
      textTransform: "uppercase",
      fontSize: "0.72rem",
      letterSpacing: "0.08em",
      borderBottom: "1px solid var(--color-border)",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "var(--color-text)",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid var(--color-border)",
      color: "var(--color-text)",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "rgba(215, 38, 56, 0.08)",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid var(--color-border)",
      backgroundColor: "var(--color-surface-3)",
      color: "var(--color-muted)",
    },
    "& .MuiTablePagination-root": {
      color: "var(--color-muted)",
    },
    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
      color: "var(--color-muted)",
    },
    "& .MuiTablePagination-select, & .MuiTablePagination-selectIcon": {
      color: "var(--color-text)",
    },
    "& .MuiDataGrid-toolbarContainer": {
      padding: "8px 12px",
      borderBottom: "1px solid var(--color-border)",
      backgroundColor: "var(--color-surface-3)",
    },
    "& .MuiDataGrid-toolbarContainer .MuiButton-root": {
      color: "var(--color-text)",
    },
    "& .MuiDataGrid-toolbarContainer .MuiInputBase-root": {
      color: "var(--color-text)",
    },
    "& .MuiDataGrid-toolbarContainer .MuiInputBase-input::placeholder": {
      color: "var(--color-muted)",
      opacity: 1,
    },
    "& .MuiDataGrid-columnSeparator": {
      color: "var(--color-border)",
    },
  },
  workspaceHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  breadcrumb: {
    color: "var(--color-muted)",
    fontSize: "0.78rem",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  filterBar: {
    display: "grid",
    gap: "12px",
    padding: "12px",
    backgroundColor: "var(--color-surface-2)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
  },
  bulkBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 12px",
    backgroundColor: "rgba(215, 38, 56, 0.12)",
    border: "1px solid rgba(215, 38, 56, 0.3)",
    borderRadius: "10px",
  },
  drawerPaper: {
    width: { xs: "100%", sm: 420 },
    backgroundColor: "var(--color-surface)",
    color: "var(--color-text)",
    borderLeft: "1px solid var(--color-border)",
  },
};

export default classes;
