import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  MessageSquare,
  Download,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import "./Layout.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">
          LF
        </div>

        <div>
          <span className="workspace-label">WORKSPACE</span>

          <h2>LowCode</h2>

          <span className="workspace-name">
            Form Platform
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-heading">MAIN MENU</p>

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        
        {/* Submissions */}
        <Link
          to="/submissions"
          className={
            location.pathname.startsWith("/submissions")
              ? "active"
              : ""
          }
        >
          <Inbox size={20} />
          <span>Submissions</span>
        </Link>

        {/* Analytics */}
        <Link
          to="/analytics"
          className={
            location.pathname.startsWith("/analytics")
              ? "active"
              : ""
          }
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </Link>

        {/* Responses */}
        <Link
          to="/responses"
          className={
            location.pathname.startsWith("/responses")
              ? "active"
              : ""
          }
        >
          <MessageSquare size={20} />
          <span>Responses</span>
        </Link>

        {/* Exports */}
        <Link
          to="/exports"
          className={
            location.pathname.startsWith("/exports")
              ? "active"
              : ""
          }
        >
          <Download size={20} />
          <span>Exports</span>
        </Link>

        {/* Audit Logs */}
        <Link
          to="/audit-logs"
          className={
            location.pathname.startsWith("/audit-logs")
              ? "active"
              : ""
          }
        >
          <ShieldCheck size={20} />
          <span>Audit Logs</span>
        </Link>

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <p className="nav-heading">ACCOUNT</p>

        {/* Settings */}
        <button
          className="sidebar-btn"
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>

        {/* Logout */}
        <button
          className="sidebar-btn logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;