import React, { useRef, useState } from 'react';
import { Wallet, Zap, LayoutDashboard, ShieldCheck, HeadphonesIcon, Globe2, BriefcaseBusiness, ChevronLeft, ChevronRight } from 'lucide-react';
import featureBgImage from '../../assets/images/header/choose-bg.jpg';

const WhyChooseUs = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    { id: 1, title: 'DAILY INCOME', desc: 'Consistent daily returns on strategic investments.', icon: <Wallet className="w-8 h-8" /> },
    { id: 2, title: 'FAST PAYMENTS', desc: 'Lightning-fast automated withdrawals.', icon: <Zap className="w-8 h-8" /> },
    { id: 3, title: 'EASY TO USE', desc: 'Intuitive dashboard for simple portfolio management.', icon: <LayoutDashboard className="w-8 h-8" /> },
    { id: 4, title: 'HIGH SECURITY', desc: 'Bank-grade encryption keeps your funds safe.', icon: <ShieldCheck className="w-8 h-8" /> },
    { id: 5, title: '24/7 SUPPORT', desc: 'Global support team available around the clock.', icon: <HeadphonesIcon className="w-8 h-8" /> },
    { id: 6, title: 'GLOBAL ACCESS', desc: 'Invest and monitor assets from anywhere.', icon: <Globe2 className="w-8 h-8" /> },
    { id: 7, title: 'EXPERT TEAM', desc: 'Strategies by industry veterans in sports investments.', icon: <BriefcaseBusiness className="w-8 h-8" /> }
  ];

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = (carouselRef.current.children[0] as HTMLElement).offsetWidth + 24; 
      setActiveIndex(Math.round(scrollPosition / cardWidth));
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = (carouselRef.current.children[0] as HTMLElement).offsetWidth + 24;
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  return (
    <section id="features" className="w-full py-24 relative overflow-hidden bg-slate-950">
      {/* Background with blend mode */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-luminosity bg-cover bg-center"
        style={{ backgroundImage: `url(${featureBgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md w-max mx-auto">
             <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Boost Your Wealth</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
            Why You Should <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Choose Us?</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Our platform provides superior results and automation tailored to your requirements. Manage your portfolio seamlessly from anywhere, anytime.
          </p>
        </div>

        {/* Carousel Grid */}
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-12 pt-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0"
        >
          {features.map((feature, i) => (
            <div 
              key={feature.id} 
              className={`bg-slate-900/50 border ${activeIndex === i ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(52,211,153,0.15)]' : 'border-white/5'} rounded-3xl p-8 flex flex-col items-start w-[85vw] sm:w-[320px] shrink-0 snap-center transition-all duration-500 hover:-translate-y-2 hover:bg-slate-800/50 group`}
            >
              <div className={`p-4 rounded-2xl mb-6 transition-colors duration-300 ${activeIndex === i ? 'bg-emerald-500 text-slate-950' : 'bg-white/5 text-emerald-400 group-hover:bg-emerald-500/20'}`}>
                {feature.icon}
              </div>
              <h3 className="text-white font-bold text-xl uppercase tracking-wide mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center justify-center space-x-6 mt-4">
          <button 
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
              activeIndex === 0 ? 'border-white/5 text-slate-600 cursor-not-allowed bg-slate-900/50' : 'border-white/20 text-white bg-slate-800 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950'
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-emerald-400 w-8' : 'bg-slate-700 hover:bg-slate-500 w-2'
                }`}
              ></button>
            ))}
          </div>

          <button 
            onClick={() => scrollToIndex(Math.min(features.length - 1, activeIndex + 1))}
            disabled={activeIndex === features.length - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border ${
              activeIndex === features.length - 1 ? 'border-white/5 text-slate-600 cursor-not-allowed bg-slate-900/50' : 'border-white/20 text-white bg-slate-800 hover:bg-emerald-500 hover:border-emerald-500 hover:text-slate-950'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;