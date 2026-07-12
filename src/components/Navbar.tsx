import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileJson, Database } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/builder", label: "Form Builder", icon: FileJson },
    { path: "/responses", label: "Responses & Data", icon: Database },
  ];

  return (
    <nav className="sticky top-0 z-50 h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
      {/* Brand & Status */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg font-display">
            F
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            FormFlow <span className="text-blue-600">Engine</span>
          </span>
        </Link>
        <div className="ml-4 hidden md:flex px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200 items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          API: v1.2.0 Stable
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin console/Support quick links */}
      <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-slate-600">
        <div className="w-px h-4 bg-slate-200"></div>
        <div className="flex items-center gap-2 text-slate-800 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          Admin Console
        </div>
      </div>
    </nav>
  );
}
