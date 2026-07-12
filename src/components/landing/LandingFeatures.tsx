import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Layout,
  Cpu,
  Split,
  Zap,
  CheckCircle,
  Eye,
  History,
  BarChart,
  Users,
  ShieldCheck,
  RotateCcw,
  FileText,
  FileSpreadsheet,
  Mail,
  Network,
} from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      title: "Drag & Drop Form Builder",
      desc: "Visually compose complex form fields with our reactive, high-performance canvas workspace.",
      icon: Layout,
      color: "from-[#4F46E5] to-[#7C3AED]",
    },
    {
      title: "AI Field Suggestions",
      desc: "Instantly generate semantic form elements based on your workspace context using integrated Gemini API suggestions.",
      icon: Cpu,
      color: "from-[#7C3AED] to-[#06B6D4]",
    },
    {
      title: "Conditional Logic",
      desc: "Apply responsive, branch-level rules to enforce field dependency visibility based on user input values.",
      icon: Split,
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      title: "Workflow Automation",
      desc: "Trigger secure webhook relays, payload synchronization events, and multi-app triggers instantly.",
      icon: Zap,
      color: "from-[#4F46E5] to-[#06B6D4]",
    },
    {
      title: "Dynamic Validation",
      desc: "Enforce rigorous format parity and type checking on both client-side and backend execution layers.",
      icon: CheckCircle,
      color: "from-[#7C3AED] to-[#4F46E5]",
    },
    {
      title: "Real-Time Preview",
      desc: "Test active user experiences with seamless device viewport toggles for desktop, tablet, and mobile screens.",
      icon: Eye,
      color: "from-[#06B6D4] to-[#7C3AED]",
    },
    {
      title: "Audit Logs",
      desc: "Track immutable system access metrics, change historical timelines, and administrator interactions securely.",
      icon: History,
      color: "from-[#4F46E5] to-[#7C3AED]",
    },
    {
      title: "Analytics Dashboard",
      desc: "Examine detailed conversion metrics, completion rates, and historical submission rates.",
      icon: BarChart,
      color: "from-[#7C3AED] to-[#06B6D4]",
    },
    {
      title: "User Management",
      desc: "Invite team members, organize distinct administrative units, and coordinate collaborative workspaces.",
      icon: Users,
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      title: "Role Based Access",
      desc: "Define strict admin, editor, and viewer permission scopes with robust secure OAuth integration.",
      icon: ShieldCheck,
      color: "from-[#4F46E5] to-[#06B6D4]",
    },
    {
      title: "Form Version Control",
      desc: "safely increment form schemas while fully preserving historical database entries with zero loss.",
      icon: RotateCcw,
      color: "from-[#7C3AED] to-[#4F46E5]",
    },
    {
      title: "Export PDF",
      desc: "Generate print-ready, high-resolution document layouts from form schemas and collected submissions.",
      icon: FileText,
      color: "from-[#06B6D4] to-[#7C3AED]",
    },
    {
      title: "Export Excel",
      desc: "Download clean, tabular spreadsheet files with one-click support for offline Microsoft Excel analysis.",
      icon: FileSpreadsheet,
      color: "from-[#4F46E5] to-[#7C3AED]",
    },
    {
      title: "Email Notifications",
      desc: "Configure customized triggers to dispatch rich transactional alerts on every successful submission.",
      icon: Mail,
      color: "from-[#7C3AED] to-[#06B6D4]",
    },
    {
      title: "REST API Integration",
      desc: "Query schemas and programmatically fetch structured JSON records using our documented developer endpoints.",
      icon: Network,
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#030712] relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#4F46E5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold tracking-wide text-indigo-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Robust Enterprise Core</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            A Complete Suite of Pro Tools
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Engineered from the ground up for high-velocity software teams, security officers, and enterprise form developers who demand pristine schema validation and robust telemetry.
          </p>
        </div>

        {/* 15 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;

            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ y: -6 }}
                className="group relative bg-[#111827]/70 backdrop-blur-md border border-white/5 hover:border-[#4F46E5]/40 p-6 rounded-[24px] transition-all duration-300 flex flex-col items-start text-left space-y-4 overflow-hidden"
              >
                {/* Hover Glow Orb inside Card */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#4F46E5]/10 rounded-full blur-2xl group-hover:bg-[#4F46E5]/20 transition-all duration-300 pointer-events-none" />

                {/* Animated Inner Border Highlight */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-[24px]" />

                {/* Gradient Icon Container */}
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-lg shadow-indigo-500/10`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base tracking-wide group-hover:text-[#06B6D4] transition-colors duration-200">
                    {feat.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
