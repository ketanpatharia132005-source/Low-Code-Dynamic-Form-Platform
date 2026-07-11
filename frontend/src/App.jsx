import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import FormBuilder from "./pages/FormBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/builder" element={<FormBuilder />} />
         <Route path="/builder/:formId" element={<FormBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
