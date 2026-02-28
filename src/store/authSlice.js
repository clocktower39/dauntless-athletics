import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "dauntlessSurveyAdminToken";
const initialToken =
  typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) || "" : "";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialToken,
    loading: false,
    error: "",
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload || "";
    },
    clearToken(state) {
      state.token = "";
    },
    setAuthLoading(state, action) {
      state.loading = Boolean(action.payload);
    },
    setAuthError(state, action) {
      state.error = action.payload || "";
    },
  },
});

export const { setToken, clearToken, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
