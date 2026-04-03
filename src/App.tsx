import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import WebsiteHome from "./Pages/WebsitePages/WebsiteHome";
import NotFoundPage from "./Pages/NotFoundPage";
import appTheme from "./theme/appTheme";
import "./App.css";

const Camps = lazy(() => import("./Pages/WebsitePages/Camps"));
const PeakPerformanceCamp = lazy(() => import("./Pages/WebsitePages/PeakPerformanceCamp"));
const CollegeCombine = lazy(() => import("./Pages/WebsitePages/CollegeCombine"));
const ClassSchedule = lazy(() => import("./Pages/WebsitePages/ClassSchedule"));
const Services = lazy(() => import("./Pages/WebsitePages/Services"));
const Staff = lazy(() => import("./Pages/WebsitePages/Staff"));
const Facility = lazy(() => import("./Pages/WebsitePages/Facility"));
const Contact = lazy(() => import("./Pages/WebsitePages/Contact"));
const CoachSurvey = lazy(() => import("./Pages/Dashboard/CoachSurvey"));
const AdminDashboard = lazy(() => import("./Pages/Dashboard/AdminDashboard"));
const SurveyOwner = lazy(() => import("./Pages/Dashboard/SurveyOwner"));
const OverviewPage = lazy(() => import("./Pages/Dashboard/pages/OverviewPage"));
const OrganizationsPage = lazy(() => import("./Pages/Dashboard/pages/OrganizationsPage"));
const OrganizationProfilePage = lazy(() => import("./Pages/Dashboard/pages/OrganizationProfilePage"));
const FamiliesPage = lazy(() => import("./Pages/Dashboard/pages/FamiliesPage"));
const FamilyProfilePage = lazy(() => import("./Pages/Dashboard/pages/FamilyProfilePage"));
const EmployeesPage = lazy(() => import("./Pages/Dashboard/pages/EmployeesPage"));
const EmployeeProfilePage = lazy(() => import("./Pages/Dashboard/pages/EmployeeProfilePage"));
const TeamsPage = lazy(() => import("./Pages/Dashboard/pages/TeamsPage"));
const TeamProfilePage = lazy(() => import("./Pages/Dashboard/pages/TeamProfilePage"));
const PeoplePage = lazy(() => import("./Pages/Dashboard/pages/PeoplePage"));
const PeopleProfilePage = lazy(() => import("./Pages/Dashboard/pages/PeopleProfilePage"));
const SurveysHubPage = lazy(() => import("./Pages/Dashboard/pages/SurveysHubPage"));
const SurveyProfilePage = lazy(() => import("./Pages/Dashboard/pages/SurveyProfilePage"));
const CampaignProfilePage = lazy(() => import("./Pages/Dashboard/pages/CampaignProfilePage"));
const ResponseProfilePage = lazy(() => import("./Pages/Dashboard/pages/ResponseProfilePage"));

function RouteFallback() {
  return <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }} />;
}

function withSuspense(element: ReactNode) {
  return (
    <Suspense fallback={<RouteFallback />}>
      {element}
    </Suspense>
  );
}

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
            <Route path="/camps" element={withSuspense(<Camps />)} />
            <Route path="/peak-performance-camp" element={withSuspense(<PeakPerformanceCamp />)} />
            <Route path="/college-combine" element={withSuspense(<CollegeCombine />)} />
            <Route path="/class-schedule" element={withSuspense(<ClassSchedule />)} />
            <Route path="/services" element={withSuspense(<Services />)} />
            <Route path="/staff" element={withSuspense(<Staff />)} />
            <Route path="/facility" element={withSuspense(<Facility />)} />
            <Route path="/contact-us" element={withSuspense(<Contact />)} />
          </>
        ) : (
          <> {/* App */}</>
        )}
        <Route path="/hs-coach-survey/:token" element={withSuspense(<CoachSurvey />)} />
        <Route
          path="/dashboard"
          element={
            withSuspense(
              <ThemeProvider theme={appTheme}>
                <CssBaseline />
                <AdminDashboard />
              </ThemeProvider>
            )
          }
        >
          <Route index element={withSuspense(<OverviewPage />)} />
          <Route path="overview" element={withSuspense(<OverviewPage />)} />
          <Route path="organizations" element={withSuspense(<OrganizationsPage />)} />
          <Route path="organizations/:organizationId" element={withSuspense(<OrganizationProfilePage />)} />
          <Route path="families" element={withSuspense(<FamiliesPage />)} />
          <Route path="families/:familyId" element={withSuspense(<FamilyProfilePage />)} />
          <Route path="employees" element={withSuspense(<EmployeesPage />)} />
          <Route path="employees/:employeeId" element={withSuspense(<EmployeeProfilePage />)} />
          <Route path="teams" element={withSuspense(<TeamsPage />)} />
          <Route path="teams/:teamId" element={withSuspense(<TeamProfilePage />)} />
          <Route path="people" element={withSuspense(<PeoplePage />)} />
          <Route path="people/:contactId" element={withSuspense(<PeopleProfilePage />)} />
          <Route path="surveys" element={withSuspense(<SurveysHubPage />)} />
          <Route path="surveys/:surveyId" element={withSuspense(<SurveyProfilePage />)} />
          <Route path="campaigns/:inviteId" element={withSuspense(<CampaignProfilePage />)} />
          <Route path="responses/:responseId" element={withSuspense(<ResponseProfilePage />)} />
        </Route>
        <Route path="/survey-owner" element={withSuspense(<SurveyOwner />)} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
