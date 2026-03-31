import { BrowserRouter as Router, Route, Routes } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import WebsiteHome from "./Pages/WebsitePages/WebsiteHome";
import Camps from "./Pages/WebsitePages/Camps";
import PeakPerformanceCamp from "./Pages/WebsitePages/PeakPerformanceCamp";
import CollegeCombine from "./Pages/WebsitePages/CollegeCombine";
import ClassSchedule from "./Pages/WebsitePages/ClassSchedule";
import Services from "./Pages/WebsitePages/Services";
import Staff from "./Pages/WebsitePages/Staff";
import Facility from "./Pages/WebsitePages/Facility";
import Contact from "./Pages/WebsitePages/Contact";
import NotFoundPage from "./Pages/NotFoundPage";
import CoachSurvey from "./Pages/Dashboard/CoachSurvey";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import SurveyOwner from "./Pages/Dashboard/SurveyOwner";
import OverviewPage from "./Pages/Dashboard/pages/OverviewPage";
import OrganizationsPage from "./Pages/Dashboard/pages/OrganizationsPage";
import OrganizationProfilePage from "./Pages/Dashboard/pages/OrganizationProfilePage";
import FamiliesPage from "./Pages/Dashboard/pages/FamiliesPage";
import FamilyProfilePage from "./Pages/Dashboard/pages/FamilyProfilePage";
import EmployeesPage from "./Pages/Dashboard/pages/EmployeesPage";
import EmployeeProfilePage from "./Pages/Dashboard/pages/EmployeeProfilePage";
import TeamsPage from "./Pages/Dashboard/pages/TeamsPage";
import TeamProfilePage from "./Pages/Dashboard/pages/TeamProfilePage";
import PeoplePage from "./Pages/Dashboard/pages/PeoplePage";
import PeopleProfilePage from "./Pages/Dashboard/pages/PeopleProfilePage";
import SurveysHubPage from "./Pages/Dashboard/pages/SurveysHubPage";
import SurveyProfilePage from "./Pages/Dashboard/pages/SurveyProfilePage";
import CampaignProfilePage from "./Pages/Dashboard/pages/CampaignProfilePage";
import ResponseProfilePage from "./Pages/Dashboard/pages/ResponseProfilePage";
import appTheme from "./theme/appTheme";
import "./App.css";

function App() {
  const checkSubDomain = () => {
    let host = window.location.host;
    let parts = host.split(".");
    let subdomain = "";
    // If we get more than 3 parts, then we have a subdomain
    // INFO: This could be 4, if you have a co.uk TLD or something like that.
    if (parts.length >= 3) {
      subdomain = parts[0];
      // Remove the subdomain from the parts list
      parts.splice(0, 1);
      // Set the location to the new url
    }
    // end line with false : true for production
    return subdomain === "app" ||
      subdomain === "172" ||
      subdomain === "192" ||
      subdomain === "10" ||
      host === "localhost:3000"
      ? true
      : true;
  };

  return (
    <HelmetProvider>
      <Router>
        <Routes>
        {/* Default website pages, anyone can access */}
        {checkSubDomain() ? (
          <>
            <Route path="/" element={<WebsiteHome />} />
            <Route path="/camps" element={<Camps />} />
            <Route path="/peak-performance-camp" element={<PeakPerformanceCamp />} />
            <Route path="/college-combine" element={<CollegeCombine />} />
            <Route path="/class-schedule" element={<ClassSchedule />} />
            <Route path="/services" element={<Services />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/facility" element={<Facility />} />
            <Route path="/contact-us" element={<Contact />} />
          </>
        ) : (
          <> {/* App */}</>
        )}
        <Route path="/hs-coach-survey/:token" element={<CoachSurvey />} />
        <Route
          path="/dashboard"
          element={
            <ThemeProvider theme={appTheme}>
              <CssBaseline />
              <AdminDashboard />
            </ThemeProvider>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="organizations" element={<OrganizationsPage />} />
          <Route path="organizations/:organizationId" element={<OrganizationProfilePage />} />
          <Route path="families" element={<FamiliesPage />} />
          <Route path="families/:familyId" element={<FamilyProfilePage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/:employeeId" element={<EmployeeProfilePage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/:teamId" element={<TeamProfilePage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="people/:contactId" element={<PeopleProfilePage />} />
          <Route path="surveys" element={<SurveysHubPage />} />
          <Route path="surveys/:surveyId" element={<SurveyProfilePage />} />
          <Route path="campaigns/:inviteId" element={<CampaignProfilePage />} />
          <Route path="responses/:responseId" element={<ResponseProfilePage />} />
        </Route>
        <Route path="/survey-owner" element={<SurveyOwner />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
