import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t: lt } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">
          FC
        </div>

        <div>
          <span className="workspace-label">
            {lt("sidebar.workspace")}
          </span>

          <h2>Form Craft</h2>

          <span className="workspace-name">
            {lt("sidebar.tagline")}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="nav-heading">
          {lt("sidebar.mainMenu")}
        </p>

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
          <span>{lt("sidebar.dashboard")}</span>
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
          <span>{lt("sidebar.submissions")}</span>
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
          <span>{lt("sidebar.analytics")}</span>
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
          <span>{lt("sidebar.responses")}</span>
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
          <span>{lt("sidebar.exports")}</span>
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
          <span>{lt("sidebar.auditLogs")}</span>
        </Link>

      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">

        <p className="nav-heading">
          {lt("sidebar.account")}
        </p>

        {/* Settings */}
        <button
          className="sidebar-btn"
          onClick={() => navigate("/settings")}
        >
          <Settings size={18} />
          <span>{lt("sidebar.settings")}</span>
        </button>

        {/* Logout */}
        <button
          className="sidebar-btn logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>{lt("sidebar.logout")}</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;