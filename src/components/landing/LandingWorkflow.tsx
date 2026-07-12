import React from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
  FilePlus,
  Sliders,
  Send,
  Database,
  PieChart,
  Download,
} from "lucide-react";

export default function LandingWorkflow() {
  const steps = [
    {
      num: "01",
      title: "Create Form",
      desc: "Instantly create a blank layout container or seed one from custom pre-built templates.",
      icon: FilePlus,
      color: "from-[#4F46E5] to-[#5a52e6]",
    },
    {
      num: "02",
      title: "Customize Fields",
      desc: "Drag-and-drop ratings, switches, dates, time pickers, or fully styled address blocks.",
      icon: Sliders,
      color: "from-[#5a52e6] to-[#7C3AED]",
    },
    {
      num: "03",
      title: "Publish",
      desc: "Lock schema version and deploy a fast, fully responsive, secure public URL.",
      icon: Send,
      color: "from-[#7C3AED] to-[#8444f0]",
    },
    {
      num: "04",
      title: "Collect Responses",
      desc: "Receive clean submissions validated directly against defined strict schema types.",
      icon: Database,
      color: "from-[#8444f0] to-[#06B6D4]",
    },
    {
      num: "05",
      title: "Analyze Reports",
      desc: "Examine detailed conversion metrics, completion rates, and historical submission rates.",
      icon: PieChart,
      color: "from-[#06B6D4] to-[#4F46E5]",
    },
    {
      num: "06",
      title: "Export Data",
      desc: "Download high-resolution PDFs or spreadsheet-ready Microsoft Excel and CSV files with one click.",
      icon: Download,
      color: "from-[#4F46E5] to-[#7C3AED]",
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-[#030712] relative overflow-hidden border-t border-b border-white/5">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold tracking-wide text-purple-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Structured Data Lifecycle</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            The FormFlow Workflow
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            A seamless, developer-friendly orchestration pipeline taking you from a blank canvas to rich, secure analytics reports in six fast steps.
          </p>
        </div>

        {/* Steps Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;

            return (
              <div key={step.num} className="relative flex flex-col items-center text-center group">
                
                {/* Visual Connector Line for Desktop */}
                {idx < 5 && (
                  <div className="absolute top-10 right-[-1.5rem] w-12 h-0.5 border-t border-dashed border-white/10 z-0 hidden lg:block group-hover:border-[#06B6D4]/50 transition-colors duration-300" />
                )}

                {/* Vertical Connector Line for Mobile */}
                {idx < 5 && (
                  <div className="absolute bottom-[-1.5rem] left-1/2 -translate-x-1/2 text-slate-600 lg:hidden py-1">
                    <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />
                  </div>
                )}

                {/* Bubble Icon with Number Badge */}
                <div className="relative mb-5 z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-lg shadow-indigo-500/10 transition-transform duration-300 group-hover:scale-105`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[#111827] border border-white/10 text-[10px] font-bold font-mono text-white flex items-center justify-center shadow-md">
                    {step.num}
                  </div>
                </div>

                {/* Copy content */}
                <div className="space-y-2 max-w-xs px-2 mb-10 lg:mb-0">
                  <h3 className="font-bold text-white text-sm tracking-wide group-hover:text-[#06B6D4] transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
