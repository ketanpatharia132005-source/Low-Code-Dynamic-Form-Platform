import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Heart, Twitter, ArrowUpRight } from "lucide-react";

export default function LandingFooter() {
  const currentYear = 2026;

  const footerColumns = [
    {
      title: "Quick Links",
      links: [
        { label: "Console Builder", href: "#features" },
        { label: "Validation Engine", href: "#features" },
        { label: "Interactive Pipeline", href: "#workflow" },
        { label: "Telemetry Live Stream", href: "#preview" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Interactive FAQ", href: "#faq" },
        { label: "Engineering Blog", href: "#" },
        { label: "SLA Commitments", href: "#" },
        { label: "Security & Trust", href: "#" },
      ],
    },
    {
      title: "Documentation",
      links: [
        { label: "Developer Docs", href: "#" },
        { label: "API Reference", href: "#" },
        { label: "JSON Schema Specs", href: "#" },
        { label: "Postgres Webhooks", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Security Audit", href: "#" },
        { label: "Cookie Parameters", href: "#" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-[#030712] text-slate-400 py-20 border-t border-white/5 relative overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4F46E5]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          
          {/* Logo & Info column */}
          <div className="md:col-span-2 space-y-5 text-left">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-black text-lg shadow-lg">
                FF
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white font-display">
                FormFlow
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The high-performance, schema-first dynamic form workflow and structured data collection engine. Built for engineering teams who value validation parity.
            </p>

            <div className="flex gap-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-[#111827] border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition hover:border-[#4F46E5]/40" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#111827] border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition hover:border-[#7C3AED]/40" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-[#111827] border border-white/5 text-slate-400 hover:text-white flex items-center justify-center transition hover:border-[#06B6D4]/40" title="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links columns */}
          {footerColumns.map((col) => (
            <div key={col.title} className="text-left space-y-4">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition duration-150 flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      {link.href === "#" && (
                        <ArrowUpRight className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition duration-150" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright details */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} FormFlow Platform Inc. All rights reserved. Registered SaaS validation orchestrator.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Formed with precision by</span>
            <Heart className="w-3.5 h-3.5 text-[#06B6D4] fill-[#06B6D4] animate-pulse" />
            <span>FormFlow Team</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
