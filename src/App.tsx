import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import SaaSLayout from "./components/SaaSLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import Responses from "./pages/Responses";
import FormResponses from "./pages/FormResponses";
import FormView from "./pages/FormView";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Architecture from "./pages/Architecture";

// Initialize Query Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  const [user, setUser] = useState<{ email: string; name: string; role: string } | null>(() => {
    const saved = localStorage.getItem("formflow_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (newUser: { email: string; name: string; role: string }) => {
    setUser(newUser);
    localStorage.setItem("formflow_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("formflow_user");
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<Home isAuthenticated={!!user} />} />

            {/* Standalone Public Form submission - completely standalone and clean */}
            <Route path="/form/:id" element={<FormView />} />

            {/* Authentication Gateway */}
            <Route
              path="/login"
              element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />}
            />

            {/* Authenticated Workspace Frame */}
            <Route
              path="/*"
              element={
                user ? (
                  <SaaSLayout user={user} onLogout={handleLogout}>
                    <Routes>
                      {/* Dashboard Overview */}
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* Low-Code Designer */}
                      <Route path="/builder" element={<FormBuilder />} />

                      {/* Collected Submissions Sheet */}
                      <Route path="/responses" element={<Responses />} />

                      {/* New Form Responses Dashboard */}
                      <Route path="/form-responses" element={<FormResponses />} />

                      {/* Metrics and Insights */}
                      <Route path="/analytics" element={<Analytics />} />

                      {/* Platform Settings */}
                      <Route path="/settings" element={<Settings />} />

                      {/* System Architecture Blueprint Infographic */}
                      <Route path="/architecture" element={<Architecture />} />

                      {/* Fallback for logged-in users */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </SaaSLayout>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
