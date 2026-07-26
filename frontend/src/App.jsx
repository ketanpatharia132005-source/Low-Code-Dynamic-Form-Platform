import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import FormBuilder from "./pages/FormBuilder";
import PublicFormView from "./pages/PublicFormView";
import FormResponses from "./pages/FormResponses";
import Analytics from "./pages/Analytics";
import SubmissionSuccess from "./pages/SubmissionSuccess";
function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/builder" element={<FormBuilder />} />
         <Route path="/builder/:formId" element={<FormBuilder />} />
         <Route path="/responses/:formId" element={<FormResponses />} />
         <Route path="/analytics" element={<Analytics />} />
         <Route path="/submission-success"
                element={<SubmissionSuccess />}
          />


         <Route path="/f/:token" element={<PublicFormView />} />
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;
