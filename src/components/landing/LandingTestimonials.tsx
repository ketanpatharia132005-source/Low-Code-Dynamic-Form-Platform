import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Star, 
  Layers, 
  Cpu, 
  Shield, 
  Zap, 
  Cloud, 
  Smartphone, 
  Key, 
  GitCommit 
} from "lucide-react";

export default function LandingTestimonials() {
  const whyFormFlow = [
    { label: "Modern UI", desc: "Designed with elegant dark-theme aesthetics similar to Linear, Stripe, and Vercel.", icon: Layers },
    { label: "AI Powered", desc: "Unlock semantic fields, form version titles, and smart options with integrated Gemini models.", icon: Cpu },
    { label: "Enterprise Security", desc: "Fully secure payload handling with role-based restrictions and encrypted parameters.", icon: Shield },
    { label: "Fast Performance", desc: "Engineered with single-digit millisecond schema routing and high-performance serverless endpoints.", icon: Zap },
    { label: "Cloud Ready", desc: "Highly available server architecture configured for scalable containerized deployment.", icon: Cloud },
    { label: "Fully Responsive", desc: "Flawless rendering on mobile, tablet, and desktop viewports with built-in preview tools.", icon: Smartphone },
    { label: "Role Based Access", desc: "Assign strict editor, viewer, or administrative permissions to secure internal forms.", icon: Key },
    { label: "Workflow Automation", desc: "Post clean JSON payloads to live Slack channels, developer webhooks, or database logs.", icon: GitCommit },
  ];

  const testimonials = [
    {
      name: "Marcus Aurelius",
      role: "VP of Product",
      company: "Vercel Platform",
      quote: "FormFlow completely revolutionized how we author internal testing cohorts. Building custom validation logic in under two minutes is mind-blowing. The dark theme and visual fidelity are state of the art.",
      avatar: "M",
      color: "from-blue-600 to-indigo-600",
    },
    {
      name: "Clara Schumann",
      role: "Lead Frontend Architect",
      company: "Stripe Connect",
      quote: "The versioning capabilities are phenomenal. We can securely update telemetry forms on production without breaking historical records in our relational databases. Perfect developer experience.",
      avatar: "C",
      color: "from-[#7C3AED] to-[#4F46E5]",
    },
    {
      name: "Ethan Hunt",
      role: "Principal Security Developer",
      company: "Linear App",
      quote: "A flawless design aesthetic paired with rigid database schema sync validation. It completely bypasses the custom form engineering sprint for my internal platform security teams.",
      avatar: "E",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden border-b border-white/5">
      
      {/* ----------------- SUBSECTION: WHY FORMFLOW ----------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold tracking-wide text-blue-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Why FormFlow Platform</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Engineered for Modern Teams
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            A schema-first platform designed to streamline secure structured data collection and telemetry with pristine visual quality.
          </p>
        </div>

        {/* Why Formflow Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyFormFlow.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#111827]/40 border border-white/5 hover:border-blue-500/30 p-5 rounded-2xl text-left space-y-3 group transition-all duration-300 hover:bg-[#111827]/70"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5]/10 to-[#7C3AED]/10 flex items-center justify-center text-[#06B6D4] border border-white/5 group-hover:scale-105 transition duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{item.label}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* ----------------- SUBSECTION: TESTIMONIALS ----------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold tracking-wide text-indigo-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Developer Reviews</span>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Endorsed by Tech Founders
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            See how fast-growing engineering teams use FormFlow to coordinate high-volume data pipelines without custom forms.
          </p>
        </div>

        {/* 3 Premium Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-[#111827]/70 backdrop-blur-md border border-white/5 hover:border-[#7C3AED]/40 p-6 rounded-[24px] flex flex-col justify-between space-y-6 shadow-xl transition-all duration-300 relative group overflow-hidden"
            >
              {/* Star Rating & Quote */}
              <div className="space-y-4 text-left">
                <div className="flex gap-1.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* User Bio with Company Logo Style */}
              <div className="flex items-center justify-between border-t border-white/5 pt-5">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${test.color} text-white flex items-center justify-center text-xs font-bold font-mono`}>
                    {test.avatar}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-white">{test.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{test.role}</p>
                  </div>
                </div>

                {/* Company Label Logo mockup */}
                <div className="text-[10px] font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/5 border border-[#06B6D4]/10 px-2 py-1 rounded">
                  {test.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
