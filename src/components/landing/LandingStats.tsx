import React from "react";
import { motion } from "motion/react";
import { BarChart3, CheckSquare, Globe2, Building2 } from "lucide-react";

export default function LandingStats() {
  const stats = [
    {
      value: "100K+",
      label: "Forms Created",
      desc: "Robust JSON & HTML schema forms defined by enterprise architects.",
      icon: CheckSquare,
      color: "text-[#4F46E5] bg-[#4F46E5]/10 border-[#4F46E5]/20",
    },
    {
      value: "1M+",
      label: "Responses Collected",
      desc: "Structured PostgreSQL database entries synchronized instantly.",
      icon: BarChart3,
      color: "text-[#7C3AED] bg-[#7C3AED]/10 border-[#7C3AED]/20",
    },
    {
      value: "99.9%",
      label: "Platform Uptime",
      desc: "Isolated serverless clusters backed by cloud failover systems.",
      icon: Globe2,
      color: "text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/20",
    },
    {
      value: "50+",
      label: "Enterprise Clients",
      desc: "Fast-growing high-scale organizations and global SaaS brands.",
      icon: Building2,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <section className="py-24 bg-[#030712] text-white relative overflow-hidden border-b border-white/5">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#4F46E5]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-[#111827]/60 backdrop-blur-md border border-white/5 p-6 rounded-[24px] text-center space-y-4 relative group transition-all duration-300 overflow-hidden"
              >
                {/* Glowing edge on hover */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] opacity-0 group-hover:opacity-100 transition duration-300" />

                {/* Icon Container */}
                <div className={`mx-auto w-12 h-12 rounded-xl border flex items-center justify-center ${stat.color} transition-transform duration-300 group-hover:scale-105`}>
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <p className="text-4xl font-extrabold text-white tracking-tight font-display bg-clip-text">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest pt-1">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1.5">
                    {stat.desc}
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
