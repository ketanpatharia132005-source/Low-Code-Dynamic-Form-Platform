
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Workflow from "../components/landing/Workflow";
import UseCases from "../components/landing/UseCases";
import Pricing from "../components/landing/Pricing";
import CTA from "../components/landing/CTA";
import FAQ from "../components/landing/FAQ";
import Footer from "../components/landing/Footer";

import "../styles/Landing.css";


function LandingPage() {
  
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <Workflow/>
      <UseCases/>
      <Pricing/>
      <CTA />
      <FAQ/>
      <Footer/>
    </div>
  );
}

export default LandingPage;