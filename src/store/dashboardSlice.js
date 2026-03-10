import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    organizations: [],
    teams: [],
    seasons: [],
    contacts: [],
    practices: [],
    surveys: [],
    invites: [],
    responses: [],
  },
  reducers: {
    setOrganizations(state, action) {
      state.organizations = action.payload || [];
    },
    setTeams(state, action) {
      state.teams = action.payload || [];
    },
    setSeasons(state, action) {
      state.seasons = action.payload || [];
    },
    setContacts(state, action) {
      state.contacts = action.payload || [];
    },
    setPractices(state, action) {
      state.practices = action.payload || [];
    },
    setSurveys(state, action) {
      state.surveys = action.payload || [];
    },
    setInvites(state, action) {
      state.invites = action.payload || [];
    },
    setResponses(state, action) {
      state.responses = action.payload || [];
    },
  },
});

export const {
  setOrganizations,
  setTeams,
  setSeasons,
  setContacts,
  setPractices,
  setSurveys,
  setInvites,
  setResponses,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
