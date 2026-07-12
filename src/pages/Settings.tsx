import React, { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import {
  Settings as SettingsIcon,
  Shield,
  Key,
  Globe,
  Bell,
  Database,
  ArrowRight,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Link,
  Cpu,
} from "lucide-react";

export default function Settings() {
  const { theme, styles } = useTheme();
  const [workspaceName, setWorkspaceName] = useState("Acme Global Labs");
  const [workspaceSlug, setWorkspaceSlug] = useState("acme-global-forms");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("ff_live_58c2be6d4e1d102e88a3b8da76f34e29");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Notification states
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [pydanticEnforced, setPydanticEnforced] = useState(true);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateKey = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randHex = Array.from({ length: 32 }, () =>
         Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setApiKey(`ff_live_${randHex}`);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6 font-sans ${styles.textPrimary}`}>
      {/* Page Title */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${styles.textHeading}`}>
          <SettingsIcon className={`w-6 h-6 ${theme === 'white' ? 'text-blue-600' : 'text-blue-400'}`} />
          <span>Console Settings</span>
        </h1>
        <p className={`text-sm mt-1 ${styles.textSecondary}`}>
          Configure workspaces, database sync rules, webhook triggers, and secure API keys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Sidebar items for Settings page */}
        <div className={`lg:col-span-3 space-y-2 p-3 rounded-xl border shadow-sm ${styles.card} ${styles.border}`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest px-3 mb-2 ${styles.textSecondary}`}>
            Workspace Panels
          </p>
          <a
            href="#profile"
            className={`flex items-center gap-2 px-3 py-2 font-bold text-xs rounded-md transition ${
              theme === 'white' 
                ? 'bg-indigo-50 text-indigo-700' 
                : theme === 'blue' 
                ? 'bg-blue-500/15 text-blue-400' 
                : theme === 'orange' 
                ? 'bg-orange-500/15 text-orange-400' 
                : 'bg-indigo-500/15 text-indigo-400'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Profile & Domains</span>
          </a>
          <a
            href="#api"
            className={`flex items-center gap-2 px-3 py-2 font-semibold text-xs rounded-md transition ${
              theme === 'white' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Key className="w-4 h-4 text-slate-400" />
            <span>Developer API Keys</span>
          </a>
          <a
            href="#notifications"
            className={`flex items-center gap-2 px-3 py-2 font-semibold text-xs rounded-md transition ${
              theme === 'white' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Bell className="w-4 h-4 text-slate-400" />
            <span>Integrations & Alerts</span>
          </a>
          <a
            href="#engine"
            className={`flex items-center gap-2 px-3 py-2 font-semibold text-xs rounded-md transition ${
              theme === 'white' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Database className="w-4 h-4 text-slate-400" />
            <span>SQL Database Engine</span>
          </a>
        </div>

        {/* Right column: Settings panels */}
        <div className="lg:col-span-9 space-y-6">
          {/* Section 1: Profile */}
          <section id="profile" className={`p-5 rounded-xl border shadow-sm space-y-4 ${styles.card} ${styles.border}`}>
            <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-2 ${styles.border} ${styles.textHeading}`}>
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Workspace Profile</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}>
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className={`w-full text-xs border outline-none p-2.5 rounded-md transition focus:ring-1 focus:ring-indigo-500/30 ${
                    theme === "white" 
                      ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500" 
                      : theme === "blue" 
                      ? "bg-blue-950/20 border-blue-200 text-slate-900 focus:border-blue-500" 
                      : theme === "orange" 
                      ? "bg-orange-950/10 border-orange-200 text-slate-900 focus:border-orange-500" 
                      : "bg-slate-950/60 border-white/[0.08] text-white focus:border-indigo-500"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ${styles.textSecondary}`}>
                  Workspace ID Slug
                </label>
                <div className="flex rounded-md shadow-xs">
                  <span className={`inline-flex items-center px-2.5 rounded-l-md border border-r-0 text-[10px] font-mono font-bold ${
                    theme === 'white' ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-white/[0.08] bg-slate-900/50 text-slate-500'
                  }`}>
                    formflow.io/
                  </span>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className={`flex-1 w-full text-xs border rounded-r-md outline-none p-2.5 transition focus:ring-1 focus:ring-indigo-500/30 font-mono ${
                      theme === "white" 
                        ? "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500" 
                        : theme === "blue" 
                        ? "bg-blue-950/20 border-blue-200 text-slate-900 focus:border-blue-500" 
                        : theme === "orange" 
                        ? "bg-orange-950/10 border-orange-200 text-slate-900 focus:border-orange-500" 
                        : "bg-slate-950/60 border-white/[0.08] text-white focus:border-indigo-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Developer Keys */}
          <section id="api" className={`p-5 rounded-xl border shadow-sm space-y-4 ${styles.card} ${styles.border}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${styles.border}`}>
              <h3 className={`font-bold text-sm flex items-center gap-2 ${styles.textHeading}`}>
                <Key className="w-4 h-4 text-slate-400" />
                <span>Developer API Keys</span>
              </h3>
              <span className={`text-[9px] border font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                theme === 'white' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
              }`}>
                Secret Credentials
              </span>
            </div>

            <p className={`text-xs ${styles.textSecondary}`}>
              Leverage standard HTTP Bearer tokens to push schemas, trigger dynamic version controls, or pull Pydantic JSON submissions programmatically.
            </p>

            <div className={`p-4 rounded-xl border space-y-3 ${
              theme === 'white' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/30 border-white/[0.05]'
            }`}>
              <div className="flex items-center justify-between">
                <label className={`text-xs font-bold ${styles.textPrimary}`}>Active Live Token</label>
                <span className={`text-[10px] font-mono ${styles.textSecondary}`}>Created 2 days ago</span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showApiKey ? "text" : "password"}
                    readOnly
                    value={apiKey}
                    className={`w-full pl-3 pr-10 py-2.5 border rounded-md outline-none text-xs font-mono select-all ${
                      theme === 'white' ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950/60 border-white/[0.08] text-slate-200'
                    }`}
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center hover:text-slate-600 cursor-pointer ${styles.textSecondary}`}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={handleCopyKey}
                  className={`px-3.5 py-2.5 text-white rounded-md text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5 ${
                    theme === 'white' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleGenerateKey}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold cursor-pointer disabled:opacity-50 ${
                    theme === 'white' ? 'text-indigo-600 hover:text-indigo-700' : 'text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Regenerate API Token</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 3: Integrations & Webhooks */}
          <section id="notifications" className={`p-5 rounded-xl border shadow-sm space-y-4 ${styles.card} ${styles.border}`}>
            <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-2 ${styles.border} ${styles.textHeading}`}>
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Pipeline & Integration Alerts</span>
            </h3>

            <div className="space-y-4">
              {/* Toggle 1 */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                theme === 'white' ? 'bg-slate-50 border-slate-150' : 'bg-slate-900/30 border-white/[0.05]'
              }`}>
                <div className="space-y-0.5 pr-4">
                  <p className={`text-xs font-bold ${styles.textHeading}`}>Slack Webhook Alerts</p>
                  <p className={`text-[10px] ${styles.textSecondary}`}>Trigger active JSON payloads to team channels upon dynamic forms submissions.</p>
                </div>
                <button
                  onClick={() => setSlackAlerts(!slackAlerts)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    slackAlerts 
                      ? (theme === 'orange' ? "bg-orange-500" : "bg-indigo-600") 
                      : (theme === 'white' ? "bg-slate-300" : "bg-slate-800")
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                      slackAlerts ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                theme === 'white' ? 'bg-slate-50 border-slate-150' : 'bg-slate-900/30 border-white/[0.05]'
              }`}>
                <div className="space-y-0.5 pr-4">
                  <p className={`text-xs font-bold ${styles.textHeading}`}>Strict Pydantic Enforcement</p>
                  <p className={`text-[10px] ${styles.textSecondary}`}>Validate all client-side submission schemas on the backend server before persistent saving.</p>
                </div>
                <button
                  onClick={() => setPydanticEnforced(!pydanticEnforced)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    pydanticEnforced 
                      ? (theme === 'orange' ? "bg-orange-500" : "bg-indigo-600") 
                      : (theme === 'white' ? "bg-slate-300" : "bg-slate-800")
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                      pydanticEnforced ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className={`flex items-center justify-between p-3 rounded-xl border ${
                theme === 'white' ? 'bg-slate-50 border-slate-150' : 'bg-slate-900/30 border-white/[0.05]'
              }`}>
                <div className="space-y-0.5 pr-4">
                  <p className={`text-xs font-bold ${styles.textHeading}`}>Daily Analytics Digest</p>
                  <p className={`text-[10px] ${styles.textSecondary}`}>Email system administrator with aggregate metrics, rates, and active submission telemetry.</p>
                </div>
                <button
                  onClick={() => setEmailDigest(!emailDigest)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    emailDigest 
                      ? (theme === 'orange' ? "bg-orange-500" : "bg-indigo-600") 
                      : (theme === 'white' ? "bg-slate-300" : "bg-slate-800")
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                      emailDigest ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: SQL Database Engine */}
          <section id="engine" className={`p-5 rounded-xl border shadow-sm space-y-4 ${styles.card} ${styles.border}`}>
            <h3 className={`font-bold text-sm border-b pb-2 flex items-center gap-2 ${styles.border} ${styles.textHeading}`}>
              <Database className="w-4 h-4 text-slate-400" />
              <span>SQL Database Engine</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className={`p-4 rounded-xl border ${
                theme === 'white' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/30 border-white/[0.05]'
              }`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${styles.textSecondary}`}>Database</p>
                <p className={`text-sm font-bold mt-1 ${styles.textHeading}`}>PostgreSQL 16.3</p>
              </div>
              <div className={`p-4 rounded-xl border ${
                theme === 'white' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/30 border-white/[0.05]'
              }`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${styles.textSecondary}`}>ORM Mapper</p>
                <p className={`text-sm font-bold mt-1 ${styles.textHeading}`}>SQLAlchemy Core</p>
              </div>
              <div className={`p-4 rounded-xl border ${
                theme === 'white' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/30 border-white/[0.05]'
              }`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${styles.textSecondary}`}>Connection Pools</p>
                <p className={`text-sm font-bold mt-1 ${styles.textHeading}`}>10 Max (Active: 1)</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
