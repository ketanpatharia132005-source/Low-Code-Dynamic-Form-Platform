import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Sparkles, Check, ArrowRight } from "lucide-react";

export default function LandingPricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter Console",
      price: "$0",
      desc: "Perfect for indie developers and rapid form schema prototyping.",
      features: [
        "Up to 3 active form schemas",
        "100 validated submissions / mo",
        "Real-time client type validation",
        "Visual spreadsheet interface",
        "Standard email triggers",
      ],
      cta: "Start Prototyping",
      highlighted: false,
      badge: "SANDBOX CLOUD",
    },
    {
      name: "Professional Suite",
      price: "$49",
      desc: "Best for growing startups, product units, and telemetry systems.",
      features: [
        "Unlimited active form schemas",
        "10,000 verified submissions / mo",
        "Interactive conditional field branch logic",
        "Direct webhook & Slack automation triggers",
        "Full schema versioning & security audit logs",
        "Export database records (CSV/Excel/PDF)",
        "Priority developer support desk",
      ],
      cta: "Upgrade to Professional",
      highlighted: true,
      badge: "MOST POPULAR",
    },
    {
      name: "Enterprise Core",
      price: "Custom",
      desc: "For security-focused companies with high-volume production queues.",
      features: [
        "SSO / SAML authentications access",
        "Unrestricted custom validation volume",
        "Branded custom subdomains (auto-SSL)",
        "Isolated database nodes storage option",
        "Custom Postgres synchronization rules",
        "SLA guaranteed uptime (99.99%)",
        "24/7 dedicated account team",
      ],
      cta: "Contact Enterprise Sales",
      highlighted: false,
      badge: "CUSTOM SLA",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#030712] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#4F46E5]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold tracking-wide text-blue-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Pristine Economics</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Flexible Developer-Friendly Tiers
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Get started for free on our sandbox environment, then upgrade seamlessly as your production payload volume scales.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`rounded-[24px] border p-8 flex flex-col justify-between text-left space-y-8 relative overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "border-[#4F46E5] bg-[#111827] text-white shadow-2xl scale-[1.03] shadow-indigo-950/40"
                  : "border-white/5 bg-[#111827]/60 text-white shadow-md hover:border-white/10"
              }`}
            >
              {/* Plan Badge Accent */}
              {plan.badge && (
                <span className="absolute -top-3 left-6 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-[9px] font-bold tracking-wider font-mono shadow-md">
                  {plan.badge}
                </span>
              )}

              {/* Glowing hover accent for non-highlighted */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#4F46E5]/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-5">
                <h3 className={`text-lg font-bold tracking-wide ${plan.highlighted ? "text-[#06B6D4]" : "text-white"}`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-5xl font-extrabold tracking-tight text-white">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-xs text-slate-400">/mo</span>
                  )}
                </div>
                
                <p className="text-slate-300 text-xs leading-relaxed">
                  {plan.desc}
                </p>

                {/* Features list */}
                <ul className="space-y-3.5 pt-6 border-t border-white/5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-xs">
                      <div className="p-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-300">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate("/login")}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-95 text-white shadow-lg shadow-indigo-500/15"
                    : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
