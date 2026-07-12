import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import {
  LayoutDashboard,
  FileJson,
  Database,
  TrendingUp,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Sparkles,
  Layers,
  Code,
  Globe,
  CheckCircle2,
  Tv,
  ClipboardList,
} from "lucide-react";

interface SaaSLayoutProps {
  children: React.ReactNode;
  user: { email: string; name: string; role: string } | null;
  onLogout: () => void;
}

export default function SaaSLayout({ children, user, onLogout }: SaaSLayoutProps) {
  const { theme, styles } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Notifications mock data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Submission Recorded",
      desc: "An enterprise response validated against Pydantic schema v1.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      title: "Workflow Version Published",
      desc: "Version v2 of Customer Feedback schema is now live on CDN.",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      title: "Postgres Sync Completed",
      desc: "Alembic migrations synced with database replica safely.",
      time: "4 hours ago",
      read: true,
    },
  ]);

  const navItems = [
    { path: "/dashboard", label: "Overview Workspace", icon: LayoutDashboard },
    { path: "/builder", label: "Low-Code Designer", icon: FileJson },
    { path: "/form-responses", label: "Form Responses", icon: ClipboardList },
    { path: "/responses", label: "Airtable Sheet View", icon: Database },
    { path: "/analytics", label: "Telemetry & Insights", icon: TrendingUp },
    { path: "/architecture", label: "System Architecture", icon: Layers },
    { path: "/settings", label: "Console Settings", icon: Settings },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Theme color adaptation helpers
  const isDarkTheme = theme === "dark";
  const isWhiteTheme = theme === "white";
  const isBlueTheme = theme === "blue";
  const isOrangeTheme = theme === "orange";

  const getSidebarHeaderTextClass = () => {
    if (isWhiteTheme) return "text-slate-900";
    return "text-white";
  };

  const getLogoBgClass = () => {
    if (isDarkTheme) return "bg-gradient-to-r from-indigo-500 to-purple-500 text-white";
    if (isWhiteTheme) return "bg-blue-600 text-white";
    return "bg-white text-slate-950 font-black";
  };

  return (
    <div className={`min-h-screen flex overflow-hidden font-sans select-none transition-colors duration-300 ${styles.bgPage}`}>
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <aside
        className={`${styles.sidebar} transition-all duration-300 flex flex-col z-40 relative flex-shrink-0 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header: Logo */}
        <div className={`h-16 flex items-center justify-between px-5 ${styles.border} border-b`}>
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-lg transition duration-200 ${getLogoBgClass()}`}>
              F
            </div>
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`font-extrabold text-sm tracking-tight font-display whitespace-nowrap ${getSidebarHeaderTextClass()}`}
              >
                FormFlow <span className="opacity-60 font-medium">Console</span>
              </motion.span>
            )}
          </Link>
          {isSidebarOpen && (
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold border ${
              isWhiteTheme 
                ? "bg-slate-100 border-slate-200 text-slate-600" 
                : isDarkTheme 
                ? "bg-white/5 border-white/10 text-indigo-400" 
                : "bg-white/10 border-white/20 text-white"
            }`}>
              v1.2
            </span>
          )}
        </div>

        {/* Workspace Quick-Menu Search */}
        {isSidebarOpen && (
          <div className="px-4 pt-4 pb-2">
            <div className={`relative rounded-md p-2 flex items-center gap-2 border ${
              isDarkTheme 
                ? "bg-slate-950/60 border-white/[0.08] text-slate-500" 
                : isWhiteTheme 
                ? "bg-slate-50 border-slate-200 text-slate-400" 
                : "bg-white/10 border-white/20 text-white/60"
            }`}>
              <Search className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent text-xs outline-none w-full font-medium placeholder-current ${
                  isWhiteTheme ? "text-slate-800 placeholder-slate-400" : "text-white placeholder-white/50"
                }`}
              />
            </div>
          </div>
        )}

        {/* Sidebar Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            let itemClass = "";
            let iconClass = "";

            if (isActive) {
              if (isDarkTheme) {
                itemClass = "bg-white/[0.08] text-white";
                iconClass = "text-indigo-400";
              } else if (isWhiteTheme) {
                itemClass = "bg-slate-100 text-slate-900";
                iconClass = "text-blue-600";
              } else if (isBlueTheme) {
                itemClass = "bg-blue-700/80 text-white";
                iconClass = "text-white";
              } else if (isOrangeTheme) {
                itemClass = "bg-white/15 text-white";
                iconClass = "text-white";
              }
            } else {
              if (isDarkTheme) {
                itemClass = "text-slate-400 hover:text-white hover:bg-white/[0.04]";
                iconClass = "text-slate-500";
              } else if (isWhiteTheme) {
                itemClass = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";
                iconClass = "text-slate-400";
              } else {
                itemClass = "text-white/70 hover:text-white hover:bg-white/10";
                iconClass = "text-white/60";
              }
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-150 relative ${itemClass}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div
                    layoutId="sidebarLine"
                    className={`absolute right-0 top-2 bottom-2 w-1 rounded-l-md ${
                      isDarkTheme ? "bg-indigo-500" : isWhiteTheme ? "bg-blue-600" : "bg-white"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Workspace Owner Status Footer */}
        <div className={`p-4 border-t ${styles.border} flex flex-col gap-2 ${
          isDarkTheme ? "bg-slate-950/20" : isWhiteTheme ? "bg-slate-50/50" : "bg-black/10"
        }`}>
          {isSidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md border flex items-center justify-center font-extrabold text-xs ${
                  isWhiteTheme 
                    ? "bg-slate-100 border-slate-200 text-slate-800" 
                    : "bg-white/10 border-white/15 text-white"
                }`}>
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] font-bold truncate ${isWhiteTheme ? "text-slate-800" : "text-white"}`}>{user?.name || "Demo Account"}</p>
                  <p className={`text-[9px] font-mono truncate ${isWhiteTheme ? "text-slate-400" : "text-white/60"}`}>{user?.role || "Workspace Owner"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className={`w-8 h-8 rounded-md border flex items-center justify-center font-extrabold text-xs ${
                isWhiteTheme 
                  ? "bg-slate-100 border-slate-200 text-slate-800" 
                  : "bg-white/10 border-white/15 text-white"
              }`}>
                {user?.name ? user.name.charAt(0) : "A"}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN CONTAINER AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navigation */}
        <header className={`h-16 border-b px-6 flex items-center justify-between shadow-xs z-30 transition-colors duration-300 ${styles.navbar} ${styles.border}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-md border transition cursor-pointer ${
                isWhiteTheme 
                  ? "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200" 
                  : isDarkTheme 
                  ? "text-slate-300 hover:text-white hover:bg-white/5 border-white/10" 
                  : "text-white hover:bg-white/10 border-white/15"
              }`}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumbs / Status */}
            <div className="hidden md:flex items-center gap-2">
              <span className={`text-xs border px-2.5 py-1 rounded font-bold font-mono ${
                isWhiteTheme 
                  ? "bg-slate-100 border-slate-200 text-slate-600" 
                  : isDarkTheme 
                  ? "bg-white/5 border-white/10 text-indigo-300" 
                  : "bg-white/10 border-white/20 text-white font-semibold"
              }`}>
                WORKSPACES
              </span>
              <span className={isWhiteTheme ? "text-slate-300" : "text-white/30"}>/</span>
              <span className={`text-xs font-bold ${isWhiteTheme ? "text-slate-700" : "text-white"}`}>Acme Dynamic Forms</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Selector (replaces activeAccent brand selector) */}
            <ThemeSelector variant="compact" />

            {/* NOTIFICATION BUTTON */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-1.5 rounded-md border transition relative cursor-pointer ${
                  isWhiteTheme 
                    ? "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-slate-200" 
                    : isDarkTheme 
                    ? "text-slate-300 hover:text-white hover:bg-white/5 border-white/10" 
                    : "text-white hover:bg-white/10 border-white/15"
                }`}
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2.5 w-80 rounded-lg border shadow-xl z-50 overflow-hidden ${
                        isDarkTheme 
                          ? "bg-slate-900 border-white/10 text-slate-100" 
                          : isWhiteTheme 
                          ? "bg-white border-slate-200 text-slate-700" 
                          : "bg-white border-blue-100 text-slate-700"
                      }`}
                    >
                      <div className={`px-4 py-3 border-b flex items-center justify-between ${
                        isDarkTheme ? "bg-slate-950 border-white/10" : "bg-slate-50 border-slate-100"
                      }`}>
                        <span className="text-xs font-bold">Notifications</span>
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-blue-500 hover:text-blue-600 font-bold cursor-pointer"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-left transition duration-150 ${
                              n.read 
                                ? (isDarkTheme ? "bg-slate-900 hover:bg-white/5" : "bg-white hover:bg-slate-55/40")
                                : (isDarkTheme ? "bg-indigo-500/10 hover:bg-indigo-500/15" : "bg-blue-50/20 hover:bg-blue-50/40")
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {!n.read && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                              <p className="text-xs font-bold">{n.title}</p>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-300 mt-0.5 leading-normal">{n.desc}</p>
                            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* USER PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-1.5 p-1.5 rounded-md border cursor-pointer ${
                  isWhiteTheme 
                    ? "hover:bg-slate-50 border-slate-200" 
                    : isDarkTheme 
                    ? "hover:bg-white/5 border-white/10" 
                    : "hover:bg-white/10 border-white/15"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-xs ${
                  isWhiteTheme ? "bg-slate-900 text-white" : "bg-white text-slate-900 font-black"
                }`}>
                  {user?.name ? user.name.charAt(0) : "A"}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 ${isWhiteTheme ? "text-slate-400" : "text-white/60"}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-xl z-50 overflow-hidden p-1.5 space-y-1 ${
                        isDarkTheme 
                          ? "bg-slate-900 border-white/10 text-slate-200" 
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className={`px-3 py-2 border-b ${isDarkTheme ? "border-white/5" : "border-slate-100"}`}>
                        <p className="text-xs font-bold">{user?.name || "Demo Account"}</p>
                        <p className="text-[9px] font-mono text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate("/settings");
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                          isDarkTheme ? "hover:bg-white/5 text-slate-300 hover:text-white" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Console Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-md hover:bg-red-50 hover:text-red-700 text-xs font-bold text-red-600 transition cursor-pointer flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC WORKSPACE PAGE VIEW */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300 ${styles.bg}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
