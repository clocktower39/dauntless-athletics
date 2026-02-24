import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import WebsiteHome from "./Pages/WebsitePages/WebsiteHome";
import Camps from "./Pages/WebsitePages/Camps";
import CollegeCombine from "./Pages/WebsitePages/CollegeCombine";
import ClassSchedule from "./Pages/WebsitePages/ClassSchedule";
import Services from "./Pages/WebsitePages/Services";
import Staff from "./Pages/WebsitePages/Staff";
import Facility from "./Pages/WebsitePages/Facility";
import Contact from "./Pages/WebsitePages/Contact";
import NotFoundPage from "./Pages/NotFoundPage";
import CoachSurvey from "./Pages/Survey/CoachSurvey";
import SurveyAdmin from "./Pages/Survey/SurveyAdmin";
import SurveyOwner from "./Pages/Survey/SurveyOwner";
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

  useEffect(() => {
    // Dispatch the event after the component is mounted and rendered
    document.dispatchEvent(new Event("render-event"));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default website pages, anyone can access */}
        {checkSubDomain() ? (
          <>
            <Route path="/" element={<WebsiteHome />} />
            <Route path="/camps" element={<Camps />} />
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
        <Route path="/survey-admin" element={<SurveyAdmin />} />
        <Route path="/survey-owner" element={<SurveyOwner />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
