import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is a dynamic schema-first form builder?",
      a: "Unlike traditional rigid form builders, FormFlow allows you to map individual inputs directly to serverless database validation rules. When a user submits responses, we match them against a Pydantic-like JSON definition dynamically to guarantee format parity and structured Postgres database storage.",
    },
    {
      q: "Can I host submission pages on my own subdomain?",
      a: "Yes! Enterprise clients can bind fully branded custom subdomains (e.g., feedback.yourcompany.com) with automated SSL certification managed entirely by our secure reverse proxy layer.",
    },
    {
      q: "How does the schema version control pipeline work?",
      a: "Every time you save, add, or delete fields in the form builder, we create a locked history version (e.g., v1, v2). Submissions are mapped to the exact version they were answered with, preserving historic spreadsheet fields with zero data loss.",
    },
    {
      q: "Can I trigger automated webhooks on submission?",
      a: "Absolutely. Under our professional tier, you can register customized webhooks to transmit clean, parsed JSON bodies to downstream services (e.g., Zapier, Slack, or direct API routers) instantly.",
    },
    {
      q: "How secure is the collected user data?",
      a: "All database connections utilize TLS 1.3 encryption. Payload fields can be configured with strict encryption controls, ensuring sensitive records are safely handled and conform to regional compliance mandates.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#030712] relative border-t border-b border-white/5 overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-[#4F46E5]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold tracking-wide text-blue-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Developer Support</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Frequently Answered Questions
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl mx-auto">
            Everything you need to know about our dynamic validation engine, database sync architecture, and billing parameters.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-[#111827]/60 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-350 shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center gap-4 text-left font-bold text-white hover:bg-white/5 transition cursor-pointer text-xs uppercase tracking-wider font-sans"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4.5 h-4.5 text-[#06B6D4] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-white/5 text-slate-400 text-xs leading-relaxed text-left">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
