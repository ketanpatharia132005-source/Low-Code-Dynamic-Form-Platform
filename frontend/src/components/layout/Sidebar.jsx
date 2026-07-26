import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import "./Layout.css";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">LF</div>

        <div>
          <span className="workspace-label">WORKSPACE</span>
          <h2>LowCode</h2>
          <span className="workspace-name">Form Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-heading">MAIN MENU</p>

        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/analytics"
          className={location.pathname === "/analytics" ? "active" : ""}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <p className="nav-heading">ACCOUNT</p>

        <button className="sidebar-btn">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <button className="sidebar-btn logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;