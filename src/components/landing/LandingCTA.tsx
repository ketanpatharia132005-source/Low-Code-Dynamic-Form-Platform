import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function LandingCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      {/* Glow Orbs behind call to action card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#4F46E5]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Call to action card container */}
        <div className="bg-[#111827] rounded-[32px] border border-white/10 p-8 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-950/20">
          
          {/* Subtle light spots */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#4F46E5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold tracking-wide text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Console Deployment</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-[1.15]">
              Ready to Orchestrate Smart Dynamic Forms?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Unlock our schema-first builder sandbox today. Configure validation rules, integrate webhooks, and start gathering clean submissions with zero upfront commitment.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("pricing");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3.5 bg-[#030712] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>View Plan Pricing</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
