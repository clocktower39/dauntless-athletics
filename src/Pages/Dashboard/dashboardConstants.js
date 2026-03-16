export const TOKEN_KEY = "dauntlessSurveyAdminToken";
export const drawerWidth = 260;

export const dayOptions = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const emptyTeam = {
  organizationId: "",
  seasonId: "",
  name: "",
  sport: "",
  level: "",
  season: "",
  expectedAthleteCount: 0,
  location: "",
  notes: "",
};

export const emptyContact = {
  teamId: "",
  teamIds: [],
  organizationId: "",
  name: "",
  role: "",
  audience: "Coach",
  email: "",
  phone: "",
  notes: "",
};

export const emptyPractice = {
  teamId: "",
  contactId: "",
  dayOfWeek: 1,
  startTime: "15:00",
  endTime: "17:00",
  location: "",
  notes: "",
};

export const emptyAthlete = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  status: "active",
  positions: "",
  skillNotes: "",
  goalNotes: "",
  notes: "",
  startDate: "",
  endDate: "",
};

export const athleteStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "removed", label: "Removed" },
  { value: "transferred", label: "Transferred" },
];

export const audienceOptions = ["Coach", "Athlete", "Parent", "Staff", "Other"];

export const organizationTypeOptions = [
  { value: "district", label: "District" },
  { value: "school", label: "School" },
  { value: "club", label: "All-Star Club" },
  { value: "company", label: "Company" },
  { value: "independent", label: "Independent" },
  { value: "other", label: "Other" },
];
