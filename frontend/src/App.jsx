import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import FormBuilder from "./pages/FormBuilder";
import PublicFormView from "./pages/PublicFormView";
import FormResponses from "./pages/FormResponses";
import Analytics from "./pages/Analytics";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import RetentionPolicy from "./pages/RetentionPolicy";
import AuditLog from "./pages/AuditLog";
import FormOverview from "./pages/FormOverview";
import FormSettings from "./pages/FormSettings";
import AllResponses from "./pages/AllResponses";
import Responses from "./pages/Responses";
import Exports from "./pages/Exports";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<LandingPage />} />
         <Route path="/login" element={<Login />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route
            path="/forms"
            element={<Dashboard />}
         />
         <Route
             path="/forms/:formId/overview"
             element={<FormOverview />} 
          />
          <Route
            path="/forms/:formId/settings"
            element={<FormSettings />}
          />
         <Route path="/builder" element={<FormBuilder />} />
         <Route path="/builder/:formId" element={<FormBuilder />} />
         <Route
            path="/responses"
            element={<Responses />}
         />
         <Route
            path="/exports"
            element={<Exports />}
         />
         <Route
            path="/settings"
            element={<Settings />}
         />
         <Route
           path="/submissions"
           element={<AllResponses />}
         />
         <Route path="/responses/:formId" element={<FormResponses />} />
         <Route path="/analytics" element={<Analytics />} />
         <Route
             path="/analytics/:formId"
             element={<Analytics />}
          />
         <Route path="/submission-success"
                element={<SubmissionSuccess />}
          />
         <Route path="/register" element={<Register />} />


         <Route path="/f/:token" element={<PublicFormView />} />
         <Route
           path="/forms/:formId/retention"
           element={<RetentionPolicy />}
         />
         <Route
            path="/audit-logs"
            element={<AuditLog />}
          />
          
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;
