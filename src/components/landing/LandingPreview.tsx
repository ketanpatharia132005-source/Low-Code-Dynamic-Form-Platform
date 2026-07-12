import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  BarChart3,
  Database,
  Users,
  Eye,
  ArrowRight,
  TrendingUp,
  LineChart,
  Grid,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function LandingPreview() {
  const [activeTab, setActiveTab] = useState<"analytics" | "spreadsheet">("analytics");

  const recentResponses = [
    { email: "sarah.k@vercel.com", form: "Vercel Enterprise Onboarding", timestamp: "2m ago", status: "Success" },
    { email: "alex.g@stripe.com", form: "Stripe API Feedback v2", timestamp: "12m ago", status: "Success" },
    { email: "jordan.m@linear.app", form: "Linear Workspace Request", timestamp: "45m ago", status: "Success" },
    { email: "emma.w@framer.com", form: "Framer Design Partner Form", timestamp: "1h ago", status: "Success" },
  ];

  return (
    <section id="preview" className="py-24 bg-[#030712] relative overflow-hidden border-t border-b border-white/5">
      {/* Background radial soft light */}
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-[#4F46E5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold tracking-wide text-indigo-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Demo Overview</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            High-Fidelity Telemetry Console
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Observe real-time form performance. Monitor strict validation success, track responsive completion averages, and view submitted database rows instantly.
          </p>
        </div>

        {/* Console Showcase Card */}
        <div className="bg-[#111827] rounded-[24px] border border-white/10 shadow-2xl overflow-hidden text-left shadow-indigo-950/20">
          
          {/* Top Title Bar */}
          <div className="px-6 py-4 bg-slate-950/40 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                formflow-console <span className="text-slate-600">//</span> live-data-environment
              </span>
            </div>

            {/* Toggle tabs */}
            <div className="flex bg-[#030712] border border-white/10 p-1 rounded-xl self-stretch sm:self-auto">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 text-[11px] font-bold rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "analytics"
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-indigo-500/15"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab("spreadsheet")}
                className={`px-4 py-2 text-[11px] font-bold rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "spreadsheet"
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-indigo-500/15"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Spreadsheet Registry</span>
              </button>
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="p-6">
            {activeTab === "analytics" ? (
              <div className="space-y-6">
                
                {/* 3 Quick Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-[#030712]/50 border border-white/5 hover:border-[#4F46E5]/30 p-5 rounded-2xl space-y-2 relative overflow-hidden group transition duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#4F46E5]/5 rounded-full blur-xl" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Submissions Volume</p>
                    <p className="text-3xl font-extrabold text-white">254,821</p>
                    <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last week
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#030712]/50 border border-white/5 hover:border-[#7C3AED]/30 p-5 rounded-2xl space-y-2 relative overflow-hidden group transition duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#7C3AED]/5 rounded-full blur-xl" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Form Completion Rate</p>
                    <p className="text-3xl font-extrabold text-white">94.8%</p>
                    <p className="text-[10px] text-[#06B6D4] font-mono font-bold">Industry Average Benchmark: 61.2%</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#030712]/50 border border-white/5 hover:border-[#06B6D4]/30 p-5 rounded-2xl space-y-2 relative overflow-hidden group transition duration-300">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#06B6D4]/5 rounded-full blur-xl" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion speed</p>
                    <p className="text-3xl font-extrabold text-white">1m 14s</p>
                    <p className="text-[10px] text-indigo-300 font-mono font-bold">Optimal funnel performance</p>
                  </div>

                </div>

                {/* Graph Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Hourly Submission graph */}
                  <div className="lg:col-span-8 bg-[#030712]/50 border border-white/5 p-6 rounded-2xl flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <LineChart className="w-4 h-4 text-[#4F46E5]" /> Hourly Submission Telemetry
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-[#111827] px-2 py-0.5 rounded border border-white/5">
                        Past 12 hours
                      </span>
                    </div>

                    {/* Chart Render with beautiful Glow Area */}
                    <div className="relative h-44 flex items-end">
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="glowGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <path
                          d="M0 120 Q50 90 100 130 T200 60 T300 100 T400 30 T500 80 T600 40 L600 176 L0 176 Z"
                          fill="url(#glowGradient)"
                          className="w-full"
                        />
                        {/* Spline Path Line */}
                        <path
                          d="M0 120 Q50 90 100 130 T200 60 T300 100 T400 30 T500 80 T600 40"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="3.5"
                          className="w-full"
                        />
                      </svg>
                      
                      {/* Horizontal Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                        <div className="border-b border-white w-full h-0.5" />
                        <div className="border-b border-white w-full h-0.5" />
                        <div className="border-b border-white w-full h-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Browser distribution circular stats */}
                  <div className="lg:col-span-4 bg-[#030712]/50 border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-white">Browser Distribution</span>
                      <p className="text-[10px] text-slate-500">Client devices submitting active schemas</p>
                    </div>

                    {/* Circular Chart */}
                    <div className="flex items-center justify-around gap-4 py-2">
                      <div className="relative w-24 h-24">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4.5" />
                          {/* Segment 1: Chrome (65%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#4F46E5" strokeWidth="4.5" strokeDasharray="65 35" strokeDashoffset="25" />
                          {/* Segment 2: Safari (25%) */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7C3AED" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="90" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-xs font-black text-white font-mono">65%</span>
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Chrome</span>
                        </div>
                      </div>

                      <div className="text-left space-y-1.5 text-[10px]">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                          <span>Google Chrome (65%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                          <span>Apple Safari (25%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-slate-600" />
                          <span>Other (10%)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* Airtable Tab View */
              <div className="bg-[#030712]/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-[#030712] border-b border-white/10 text-slate-400 font-bold">
                      <tr>
                        <th className="px-5 py-4">Client Email Address</th>
                        <th className="px-5 py-4">Active Form Schema</th>
                        <th className="px-5 py-4">Timestamp</th>
                        <th className="px-5 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-300">
                      {recentResponses.map((res, i) => (
                        <tr key={i} className="hover:bg-white/5 transition duration-200">
                          <td className="px-5 py-4 text-[#06B6D4] font-semibold">{res.email}</td>
                          <td className="px-5 py-4 text-slate-200">{res.form}</td>
                          <td className="px-5 py-4 text-slate-400">{res.timestamp}</td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-mono">
                              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
