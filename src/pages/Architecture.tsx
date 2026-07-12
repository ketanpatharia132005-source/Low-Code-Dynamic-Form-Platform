import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../context/ThemeContext";
import {
  Database,
  Cloud,
  Link as LinkIcon,
  FileText,
  LayoutDashboard,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Cpu,
  Layers,
  Lock,
  Zap,
  Sparkles,
  Globe,
  Users,
  Check,
  FileSpreadsheet,
  Terminal,
  Activity,
  Workflow,
  MousePointer,
  Maximize2
} from "lucide-react";

interface StepSpec {
  id: number;
  num: string;
  title: string;
  desc: string;
  subPoints: string[];
  role: "Admin" | "System" | "User";
  payloadTitle: string;
  payloadType: "json" | "token" | "sql" | "bash";
  payloadCode: string;
}

export default function Architecture() {
  const { theme, styles } = useTheme();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  // List of architecture steps in sequence
  const steps: StepSpec[] = [
    {
      id: 1,
      num: "1️⃣",
      title: "Create Form Schema",
      desc: "Admin designs dynamic inputs with custom validation parameters inside the drag-and-drop React visual builder.",
      subPoints: [
        "Interactive canvas UI layout",
        "Strict input typing (email, text, date)",
        "Regex/custom verification setup"
      ],
      role: "Admin",
      payloadTitle: "Client-Side Form Design (JSON Schema)",
      payloadType: "json",
      payloadCode: `{
  "id": "epa-safety-audit",
  "title": "EPA Environmental Assessment Form",
  "version": 1,
  "fields": [
    { "name": "facility_name", "type": "text", "required": true },
    { "name": "co2_emissions", "type": "number", "min": 0 }
  ]
}`
    },
    {
      id: 2,
      num: "2️⃣",
      title: "Arrange & Logic Rules",
      desc: "Reorder field hierarchy, toggle mandatory locks, and configure advanced conditional rules dynamically.",
      subPoints: [
        "Z-order drag positioning",
        "Conditional display rules",
        "Field dependency map"
      ],
      role: "Admin",
      payloadTitle: "Conditional Logic Schema",
      payloadType: "json",
      payloadCode: `{
  "conditions": [
    {
      "field": "waste_classification",
      "equals": "hazardous",
      "actions": [{ "target": "chemical_manifest", "show": true }]
    }
  ]
}`
    },
    {
      id: 3,
      num: "3️⃣",
      title: "Publish & Schema Version",
      desc: "Compile structure, freeze version, send bundle payload to backend schema registers, and secure in-app IDs.",
      subPoints: [
        "Alembic auto-generated revisions",
        "JSON-B schema serialization",
        "Global immutable template ID"
      ],
      role: "System",
      payloadTitle: "Schema Freeze Event Payload",
      payloadType: "json",
      payloadCode: `{
  "event": "SCHEMA_PUBLISH",
  "form_id": 4,
  "version": "1.0.4",
  "published_by": "admin@acme.com",
  "db_status": "COMMITTED"
}`
    },
    {
      id: 4,
      num: "4️⃣",
      title: "Generate Public Token Link",
      desc: "Platform backend processes the immutable schema ID, signs a secure session token, and spins up a dedicated public URL.",
      subPoints: [
        "Cryptographically secure token",
        "CDN edge route distribution",
        "Direct dynamic workspace entry"
      ],
      role: "System",
      payloadTitle: "JWT Form Token Payload",
      payloadType: "token",
      payloadCode: `// Generated Public Form Share URL:
https://formflow.io/form/4_epa_assessment_3f9a7c2e1b8d

// Signed Payload Token
Header: { "alg": "HS256", "typ": "JWT" }
Claims: {
  "form_id": 4,
  "ver": "1.0.4",
  "public_access": true,
  "exp": 1783382400
}`
    },
    {
      id: 5,
      num: "5️⃣",
      title: "View Public Form",
      desc: "End-user opens the secure public web layout. Client calls API to resolve, compile, and render the custom inputs in real-time.",
      subPoints: [
        "Dynamic JSON-to-HTML parser",
        "Zero bundle size per form",
        "Clean responsive typography"
      ],
      role: "User",
      payloadTitle: "Backend Resolve Query (SQL)",
      payloadType: "sql",
      payloadCode: `SELECT v.id, v.fields, f.title, f.category
FROM form_versions v
JOIN forms f ON v.form_id = f.id
WHERE f.id = 4 AND v.is_published = true
LIMIT 1;`
    },
    {
      id: 6,
      num: "6️⃣",
      title: "User Fills & Validates",
      desc: "The responder inputs data. Front-end does local validation checks and verifies file attachments to guarantee schema integrity.",
      subPoints: [
        "Reactive client validation",
        "Pydantic schema mapping pre-checks",
        "Responsive focus constraints"
      ],
      role: "User",
      payloadTitle: "Reactive Submission Verification",
      payloadType: "json",
      payloadCode: `{
  "client_validated": true,
  "inputs": {
    "facility_name": "Springfield Power Plant",
    "co2_emissions": 1420
  },
  "errors": {}
}`
    },
    {
      id: 7,
      num: "7️⃣",
      title: "Submit Secure Form Response",
      desc: "Transmits verified bundle over secure TLS, performs strict server-side validation against database types, and writes the response.",
      subPoints: [
        "Strict back-end parsing",
        "Prevention of duplicate tokens",
        "Commit response rows safely"
      ],
      role: "System",
      payloadTitle: "Database Record Transaction (Postgres SQL)",
      payloadType: "sql",
      payloadCode: `BEGIN TRANSACTION;

INSERT INTO form_submissions (form_version_id, responder_ip, payload)
VALUES (104, '192.168.1.45', '{"facility_name": "Spring Springfield", "co2_emissions": 1420}');

UPDATE forms SET last_submission_at = NOW() WHERE id = 4;

COMMIT;`
    },
    {
      id: 8,
      num: "8️⃣",
      title: "Response & Telemetry Board",
      desc: "Real-time sync sends submission details to the admin dashboard for visualization, telemetry reports, and data exports.",
      subPoints: [
        "Interactive Recharts trends",
        "Export to CSV, Excel, or PDF",
        "Slack & PagerDuty notification webhooks"
      ],
      role: "Admin",
      payloadTitle: "Admin Webhook Dispatch Log",
      payloadType: "bash",
      payloadCode: `curl -X POST https://hooks.slack.com/services/T00/B00/X00 \\
  -H 'Content-type: application/json' \\
  -d '{
    "text": "🚨 New EPA Assessment Received! Facility: Springfield Power. Emissions: 1420 tons."
  }'`
    }
  ];

  const summaryBullets = [
    "Create Dynamic Forms",
    "Publish Forms Safely",
    "Generate Public Links",
    "Collect Responses",
    "Store in Postgres Database",
    "Export Dynamic Reports",
    "Automatic Version Control",
    "End-to-End Workflow Automation"
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "System": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "User": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getPayloadLanguage = (type: string) => {
    switch (type) {
      case "json": return "JSON Schema";
      case "token": return "JWT Token Spec";
      case "sql": return "PostgreSQL Query";
      case "bash": return "cURL Webhook Request";
      default: return "Code";
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans ${styles.textPrimary}`}>
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-black font-mono tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
              <Activity className="w-3 h-3 text-indigo-400 animate-pulse" />
              SaaS Blueprint System
            </span>
          </div>
          <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2.5 ${styles.textHeading}`}>
            🚀 Low-Code Dynamic Form & Workflow Platform – End-to-End Flow
          </h1>
          <p className={`text-sm mt-1.5 leading-relaxed max-w-3xl ${styles.textSecondary}`}>
            Interactive system architecture infographic representing our premium enterprise cloud workflow. Track how dynamic JSON schemas transform into live responsive web forms, process secure client-side transactions, and sync back to Postgres DB with real-time telemetry pipelines.
          </p>
        </div>
        
        {/* Interactive Mode Info badge */}
        <div className={`p-3 rounded-2xl border flex items-center gap-3 shrink-0 ${
          theme === "dark" ? "bg-slate-900/50 border-white/[0.06]" : "bg-slate-50 border-slate-250 shadow-3xs"
        }`}>
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/20 animate-bounce">
            <MousePointer className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wide text-amber-500">Interactive Model</p>
            <p className="text-[9px] text-slate-400 leading-none mt-0.5">Click any stage card to simulate live API data</p>
          </div>
        </div>
      </div>

      {/* Grid: Main Interactive Schema Blueprint */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left 8 columns: Interactive Stage Panels */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Section 1: Form Builder (Admin Domain) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <h2 className="text-sm font-black font-mono tracking-wider uppercase text-blue-500">
                Section 1: Admin Form Builder Workspace
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.slice(0, 3).map((step) => (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between h-56 select-none ${
                    activeStep === step.id 
                      ? "ring-2 ring-blue-500 border-transparent shadow-lg transform -translate-y-1 " + (theme === "dark" ? "bg-slate-900/90" : "bg-blue-50/40")
                      : hoveredStep === step.id
                      ? "border-blue-400/50 transform -translate-y-0.5 " + (theme === "dark" ? "bg-slate-900/40" : "bg-slate-50")
                      : styles.card + " " + styles.border
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xl">{step.num}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getRoleColor(step.role)}`}>
                        {step.role}
                      </span>
                    </div>
                    <h3 className="text-xs font-extrabold tracking-tight truncate mt-1">
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-350 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[8px] font-bold">
                    <span className="text-blue-500 uppercase tracking-widest font-mono">Stage {step.id}</span>
                    <span className="text-slate-400">View Data Payload →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro Flow Connector Map 1 */}
            <div className={`p-3 rounded-2xl border flex items-center justify-center gap-1.5 text-[9px] font-mono font-extrabold shadow-3xs ${
              theme === "dark" ? "bg-slate-950/40 border-white/[0.04]" : "bg-slate-50/50 border-slate-200"
            }`}>
              <span className="text-blue-500">Admin Dashboard</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-purple-400">Form Builder</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-amber-500">Backend API</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-500">Database</span>
            </div>
          </div>

          {/* Section 2: Shareable Public Form Link (Secure Gateway) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <h2 className="text-sm font-black font-mono tracking-wider uppercase text-purple-500">
                Section 2: Shareable Public Form & Security Gateway
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.slice(3, 5).map((step) => (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between h-56 select-none ${
                    activeStep === step.id 
                      ? "ring-2 ring-purple-500 border-transparent shadow-lg transform -translate-y-1 " + (theme === "dark" ? "bg-slate-900/90" : "bg-purple-50/20")
                      : hoveredStep === step.id
                      ? "border-purple-400/50 transform -translate-y-0.5 " + (theme === "dark" ? "bg-slate-900/40" : "bg-slate-50")
                      : styles.card + " " + styles.border
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xl">{step.num}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getRoleColor(step.role)}`}>
                        {step.role}
                      </span>
                    </div>
                    <h3 className="text-xs font-extrabold tracking-tight mt-1">
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-350 leading-relaxed">
                      {step.desc}
                    </p>
                    {step.id === 4 && (
                      <div className="bg-indigo-500/5 border border-indigo-500/10 p-1.5 px-2 rounded-lg text-[9px] font-mono text-indigo-400 truncate mt-1">
                        https://app.com/forms/3f9a7c2e1b8d
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[8px] font-bold">
                    <span className="text-purple-500 uppercase tracking-widest font-mono">Stage {step.id}</span>
                    <span className="text-slate-400">View Data Payload →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro Flow Connector Map 2 */}
            <div className={`p-3 rounded-2xl border flex items-center justify-center gap-1.5 text-[9px] font-mono font-extrabold shadow-3xs ${
              theme === "dark" ? "bg-slate-950/40 border-white/[0.04]" : "bg-slate-50/50 border-slate-200"
            }`}>
              <span className="text-purple-400">Backend API</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-indigo-400">Database</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-blue-500">Generate Unique Token</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-500">Public URL Handshake</span>
            </div>
          </div>

          {/* Section 3: Form Submission Flow */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-black font-mono tracking-wider uppercase text-emerald-500">
                Section 3: End-User Intake & Response Pipeline
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.slice(5, 7).map((step) => (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between h-56 select-none ${
                    activeStep === step.id 
                      ? "ring-2 ring-emerald-500 border-transparent shadow-lg transform -translate-y-1 " + (theme === "dark" ? "bg-slate-900/90" : "bg-emerald-500/10")
                      : hoveredStep === step.id
                      ? "border-emerald-400/50 transform -translate-y-0.5 " + (theme === "dark" ? "bg-slate-900/40" : "bg-slate-50")
                      : styles.card + " " + styles.border
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xl">{step.num}</span>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getRoleColor(step.role)}`}>
                        {step.role}
                      </span>
                    </div>
                    <h3 className="text-xs font-extrabold tracking-tight mt-1">
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-350 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[8px] font-bold">
                    <span className="text-emerald-500 uppercase tracking-widest font-mono">Stage {step.id}</span>
                    <span className="text-slate-400">View Data Payload →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Micro Flow Connector Map 3 */}
            <div className={`p-3 rounded-2xl border flex items-center justify-center gap-1.5 text-[9px] font-mono font-extrabold shadow-3xs ${
              theme === "dark" ? "bg-slate-950/40 border-white/[0.04]" : "bg-slate-50/50 border-slate-200"
            }`}>
              <span className="text-indigo-400">Frontend Client</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-purple-400">Submission API Endpoint</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-500">Pydantic Validation Guard</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-blue-500">Postgres Write</span>
            </div>
          </div>

          {/* Section 4: Admin Response Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h2 className="text-sm font-black font-mono tracking-wider uppercase text-orange-500">
                Section 4: Admin Management & Analytics Panel
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {steps.slice(7, 8).map((step) => (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-5 rounded-2xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between h-44 select-none ${
                    activeStep === step.id 
                      ? "ring-2 ring-orange-500 border-transparent shadow-lg transform -translate-y-1 " + (theme === "dark" ? "bg-slate-900/90" : "bg-orange-50/20")
                      : hoveredStep === step.id
                      ? "border-orange-400/50 transform -translate-y-0.5 " + (theme === "dark" ? "bg-slate-900/40" : "bg-slate-50")
                      : styles.card + " " + styles.border
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{step.num}</span>
                        <h3 className="text-xs font-extrabold tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getRoleColor(step.role)}`}>
                        {step.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-350 leading-relaxed max-w-2xl">
                      {step.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {step.subPoints.map((point, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 text-[8px] font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md px-2 py-0.5"
                        >
                          <Check className="w-2.5 h-2.5" />
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[8px] font-bold">
                    <span className="text-orange-500 uppercase tracking-widest font-mono">Stage {step.id}</span>
                    <span className="text-slate-400">View Bash Webhook Payload →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 4 columns: Live Data Stream Console Simulator */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Main Simulated Console */}
          <div className={`rounded-2xl border shadow-md flex flex-col justify-between sticky top-6 overflow-hidden ${styles.card} ${styles.border}`}>
            
            {/* Console Header */}
            <div className="bg-slate-950 p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                  Live API Data Stream
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
                  ACTIVE SYNC
                </span>
              </div>
            </div>

            {/* Console Active Step Title */}
            <div className="bg-slate-900 p-4 border-b border-white/5">
              <p className="text-[8px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                Stage {activeStep} Simulator State
              </p>
              <h3 className="text-xs font-extrabold text-white mt-0.5 truncate">
                {steps[activeStep - 1].payloadTitle}
              </h3>
            </div>

            {/* Console Code Window */}
            <div className="bg-slate-950 p-4 font-mono text-[10px] text-slate-300 leading-relaxed overflow-x-auto h-72">
              <pre className="text-left text-slate-300">
                {steps[activeStep - 1].payloadCode}
              </pre>
            </div>

            {/* Interactive Step Selector Footer */}
            <div className="bg-slate-900 p-4 border-t border-white/5 space-y-3">
              <p className="text-[9px] font-mono text-slate-400 uppercase font-semibold">
                Jump to another Flow State:
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {steps.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveStep(st.id)}
                    className={`p-1.5 py-1 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      activeStep === st.id
                        ? "bg-indigo-500 border-indigo-400 text-white shadow-sm"
                        : "bg-slate-950 border-white/[0.05] text-slate-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    Stg {st.id}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bullet Points Block Details */}
          <div className={`p-5 rounded-2xl border shadow-sm space-y-3 ${styles.card} ${styles.border}`}>
            <h4 className={`text-xs font-bold tracking-tight uppercase font-mono text-indigo-400`}>
              Schema Specs
            </h4>
            <div className="space-y-2.5">
              {steps[activeStep - 1].subPoints.map((pt, i) => (
                <div key={i} className="flex gap-2 items-start text-[10px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{pt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Section 5: Bottom Summary Block */}
      <div className={`p-6 md:p-8 rounded-[24px] border shadow-md relative overflow-hidden ${styles.card} ${styles.border}`}>
        {/* Abstract design vector overlay */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-indigo-500/[0.03] to-transparent pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black font-mono tracking-widest uppercase text-indigo-400">
              Platform Workflow Capabilities Matrix
            </h3>
          </div>
          
          <p className={`text-xs max-w-3xl leading-relaxed ${styles.textSecondary}`}>
            Our platform guarantees maximum integrity using structured schemas. By mapping each interface directly to strict typing constraints, we prevent malformed data submissions, enforce precise validation rules, and allow seamless downstream integration exports.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
            {summaryBullets.map((bullet, index) => (
              <div
                key={index}
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 transition duration-200 ${
                  theme === "dark" 
                    ? "bg-slate-900/50 border-white/[0.04] hover:border-indigo-500/20" 
                    : "bg-slate-50 border-slate-200 hover:border-indigo-300/30"
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/25 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-[10px] font-bold leading-tight">{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
