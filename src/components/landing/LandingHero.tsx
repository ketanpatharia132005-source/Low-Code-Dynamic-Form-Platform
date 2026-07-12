import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  FileText, 
  Shield, 
  Layers, 
  Zap, 
  Cpu, 
  TrendingUp, 
  Activity, 
  Users, 
  CheckCircle2, 
  Compass, 
  Lock
} from "lucide-react";

export default function LandingHero() {
  const navigate = useNavigate();

  const companies = [
    { name: "Google Workspace", fontClass: "font-bold text-sm tracking-tight text-slate-500 hover:text-white" },
    { name: "Microsoft Cloud", fontClass: "font-semibold text-sm tracking-tight text-slate-500 hover:text-white" },
    { name: "Amazon AWS", fontClass: "font-extrabold text-sm italic text-slate-500 hover:text-white" },
    { name: "Vercel Platform", fontClass: "font-black text-sm tracking-wider text-slate-500 hover:text-white" },
    { name: "Stripe Connect", fontClass: "font-black text-sm tracking-tight text-slate-500 hover:text-white" },
    { name: "Framer Engine", fontClass: "font-bold text-sm tracking-tight text-slate-500 hover:text-white" },
    { name: "GitHub Enterprise", fontClass: "font-semibold text-sm tracking-tight text-slate-500 hover:text-white" },
  ];

  return (
    <section className="relative pt-36 pb-20 overflow-hidden bg-[#030712]">
      {/* Soft Light Spots */}
      <div className="absolute top-[10%] right-[5%] w-[450px] h-[450px] bg-[#4F46E5]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] bg-[#7C3AED]/12 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Premium Enterprise Intro */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-xs font-semibold tracking-wide text-indigo-300 shadow-lg shadow-indigo-500/5 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4]"></span>
              </span>
              <span className="flex items-center gap-1">
                🚀 Enterprise AI Platform
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display"
            >
              FormFlow – <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]">
                Low-Code Dynamic
              </span>{" "}
              Form Builder
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal"
            >
              Create powerful enterprise forms without writing code. Design forms using drag-and-drop components, AI-powered suggestions, workflow automation, role-based access control, analytics, audit logs and secure cloud-ready architecture.
            </motion.p>

            {/* Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {/* Primary Button */}
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#5a52e6] hover:to-[#8444f0] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Button */}
              <button
                onClick={() => {
                  const el = document.getElementById("preview");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3.5 bg-[#111827] hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 fill-[#06B6D4] text-[#06B6D4]" />
                <span>Watch Demo</span>
              </button>

              {/* Third Button */}
              <button
                onClick={() => {
                  const el = document.getElementById("faq");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Documentation</span>
              </button>
            </motion.div>
          </div>

          {/* Right Side: Interactive Dashboard Mockup */}
          <div className="lg:col-span-6 relative pt-6 lg:pt-0">
            
            {/* Background glowing orb beneath illustration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4F46E5]/10 to-[#06B6D4]/10 rounded-3xl blur-2xl -z-10" />

            {/* Dashboard Container Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-[#111827] border border-white/15 rounded-3xl p-6 shadow-2xl overflow-hidden shadow-indigo-950/50"
            >
              
              {/* Top window headers */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  <span className="text-[10px] text-slate-500 font-mono ml-3">formflow_enterprise_kernel.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold bg-[#06B6D4]/10 text-[#06B6D4] px-2.5 py-0.5 rounded-full border border-[#06B6D4]/20">
                    SCHEMA ENGINE V3.0
                  </span>
                </div>
              </div>

              {/* Graphical Body Mockup */}
              <div className="space-y-4">
                
                {/* 1. Drag & Drop Component Preview Panel */}
                <div className="bg-[#030712]/90 rounded-2xl border border-white/10 p-4 space-y-3 relative">
                  
                  {/* Floating Drag Element Handle */}
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#4F46E5]" /> Active Layout Builder
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      AUTO-PERSISTED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-left text-xs space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Field Type</p>
                      <p className="text-white font-semibold">Star Rating Widget</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-left text-xs space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Validation Rule</p>
                      <p className="text-white font-semibold">Min: 1 | Max: 5 Stars</p>
                    </div>
                  </div>
                </div>

                {/* 2. Custom Live Responses Feed */}
                <div className="bg-[#030712]/40 rounded-2xl border border-white/10 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-400" /> Live Submissions Stream
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Stream mode: Active</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl text-[10px]">
                      <span className="text-slate-300 font-mono">auth_user_signup_prod@stripe.com</span>
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Authorized v1.3
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl text-[10px]">
                      <span className="text-slate-300 font-mono">corporate_feedback@amazon.com</span>
                      <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Authorized v1.3
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Micro Analytics Graph */}
                <div className="bg-[#030712]/90 rounded-2xl border border-white/10 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#06B6D4]" /> Schema Conversion Analytics
                    </span>
                    <span className="text-[10px] text-indigo-300 font-bold font-mono">+42.1% Today</span>
                  </div>
                  
                  {/* Dynamic mini bar graph */}
                  <div className="flex items-end gap-1.5 h-14 pt-2">
                    {[40, 85, 55, 100, 70, 95, 110, 65, 90, 105, 80, 115].map((val, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${val}%` }}
                        transition={{ duration: 1, delay: 0.3 + idx * 0.04 }}
                        className="bg-gradient-to-t from-[#4F46E5] to-[#06B6D4] rounded-sm flex-1"
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Floating Security Badge widget */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/4 -right-2 bg-slate-950 border border-white/10 text-white rounded-2xl p-3.5 shadow-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#4F46E5] flex items-center justify-center text-white">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    Role-Based Access
                  </p>
                  <p className="text-[11px] font-black text-white">RBAC Secured</p>
                </div>
              </motion.div>

              {/* Floating Workflow Badge widget */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-1/4 -left-2 bg-[#111827] border border-white/10 rounded-2xl p-3.5 shadow-xl flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#06B6D4] to-[#4F46E5] flex items-center justify-center text-white font-bold text-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    Automation Engine
                  </p>
                  <p className="text-[11px] font-bold text-slate-100">Live JSON Webhook</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>

        {/* Brand partners */}
        <div className="pt-24 pb-8 text-center space-y-6">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            ENGINEERING WORKFLOWS BACKED BY DYNAMIC SCHEMAS AT GLOBAL ENTERPRISES
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-80">
            {companies.map((co) => (
              <span
                key={co.name}
                className={`transition-colors duration-200 cursor-pointer ${co.fontClass}`}
              >
                {co.name}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
