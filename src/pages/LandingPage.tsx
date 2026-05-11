import React from 'react';
import Hero from '../components/website/HeroSection';
import ProfitCalculator from '@/components/website/ProfitCalculator';
import About from '../components/website/NewAbout';
import WhyChooseUs from '@/components/website/WhyChooseUs';
import HowToInvest from '../components/website/HowToInvest';

const LandingPage = () => {
  return (
    <div className="font-sans bg-slate-950 text-slate-50 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200">
      <Hero />
      <ProfitCalculator />
      <About />
      <WhyChooseUs />
      <HowToInvest />
      {/* We will add the About, Plans, etc., components here later */}
    </div>
  );
};

export default LandingPage;