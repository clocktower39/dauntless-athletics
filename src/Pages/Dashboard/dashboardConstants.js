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
  location: "",
  notes: "",
};

export const emptyContact = {
  teamId: "",
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

export const audienceOptions = ["Coach", "Athlete", "Parent", "Staff", "Other"];

export const organizationTypeOptions = [
  { value: "district", label: "District" },
  { value: "school", label: "School" },
  { value: "club", label: "All-Star Club" },
  { value: "company", label: "Company" },
  { value: "independent", label: "Independent" },
  { value: "other", label: "Other" },
];
