import React from "react";
import LandingNavbar from "../components/landing/LandingNavbar";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingWorkflow from "../components/landing/LandingWorkflow";
import LandingPreview from "../components/landing/LandingPreview";
import LandingStats from "../components/landing/LandingStats";
import LandingTestimonials from "../components/landing/LandingTestimonials";
import LandingPricing from "../components/landing/LandingPricing";
import LandingFAQ from "../components/landing/LandingFAQ";
import LandingCTA from "../components/landing/LandingCTA";
import LandingFooter from "../components/landing/LandingFooter";

interface HomeProps {
  isAuthenticated: boolean;
}

export default function Home({ isAuthenticated }: HomeProps) {
  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#4F46E5] selection:text-white overflow-x-hidden font-sans relative">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(79,70,229,0.18),rgba(124,58,237,0.06),transparent_80%)] pointer-events-none z-0" />
      
      {/* Floating Ambient Orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#4F46E5]/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[50%] right-[-10%] w-[600px] h-[600px] bg-[#7C3AED]/8 rounded-full blur-[150px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] bg-[#06B6D4]/6 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Grid Overlay for Tech Vibe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0 opacity-40" />

      {/* 1. Navbar */}
      <LandingNavbar isAuthenticated={isAuthenticated} />

      <div className="relative z-10">
        {/* 2. Hero Section */}
        <LandingHero />

        {/* 3. Features Grid */}
        <LandingFeatures />

        {/* 4. Timeline Pipeline */}
        <LandingWorkflow />

        {/* 5. Console Preview & Interactive Graphs */}
        <LandingPreview />

        {/* 6. High-Contrast Stats */}
        <LandingStats />

        {/* 7. Glass Testimonials */}
        <LandingTestimonials />

        {/* 8. Pricing Layout */}
        <LandingPricing />

        {/* 9. FAQ Accordion */}
        <LandingFAQ />

        {/* 10. Direct CTA */}
        <LandingCTA />

        {/* 11. Footer Section */}
        <LandingFooter />
      </div>
    </div>
  );
}
