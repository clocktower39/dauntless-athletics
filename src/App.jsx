import React, { useEffect } from "react";
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
            <Route exact path="/" element={<WebsiteHome />} />
            <Route exact path="/camps" element={<Camps />} />
            <Route exact path="/college-combine" element={<CollegeCombine />} />
            <Route exact path="/class-schedule" element={<ClassSchedule />} />
            <Route exact path="/services" element={<Services />} />
            <Route exact path="/staff" element={<Staff />} />
            <Route exact path="/facility" element={<Facility />} />
            <Route exact path="/contact-us" element={<Contact />} />
          </>
        ) : (
          <> {/* App */}</>
        )}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
