import React from 'react';
import { UserPlus, ArrowRightLeft, ArrowDownToLine, ArrowRight } from 'lucide-react';
import mapBgImage from '../../assets/images/header/invest-bg.jpg'; 

const HowToInvest = () => {
  const processSteps = [
    {
      id: 1,
      stepText: 'FIRST STEP',
      actionText: 'SIGN UP',
      offset: 'lg:translate-y-12',
      icon: <UserPlus className="w-10 h-10 text-emerald-400" />
    },
    {
      id: 2,
      stepText: 'SECOND STEP',
      actionText: 'MAKE A DEPOSIT',
      offset: 'lg:-translate-y-12',
      icon: <ArrowRightLeft className="w-10 h-10 text-cyan-400" />
    },
    {
      id: 3,
      stepText: 'THIRD STEP',
      actionText: 'WITHDRAW',
      offset: 'lg:translate-y-12',
      icon: <ArrowDownToLine className="w-10 h-10 text-emerald-400" />
    }
  ];

  return (
    <section className="w-full py-32 bg-slate-950 relative overflow-hidden border-t border-white/5">
      
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-5 mix-blend-screen bg-center bg-no-repeat bg-cover pointer-events-none"
        style={{ backgroundImage: `url(${mapBgImage})` }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Text Section */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md w-max mx-auto">
             <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">Getting Started</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
            Invest Your Money <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">More Smartly</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto font-light">
            It's a simple way to start investing. You don't need a deep wallet to start earning. Pick an amount you can afford, and build your portfolio over time.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative w-full flex justify-center items-center">
          
          {/* Connecting Line (Desktop Only) */}
          <div className="absolute top-1/2 left-[10%] right-[10%] transform -translate-y-1/2 hidden lg:block z-0 pointer-events-none">
            <svg width="100%" height="200" viewBox="0 0 1000 200" fill="none" preserveAspectRatio="none">
              <path 
                d="M 0 100 C 250 -50, 750 250, 1000 100" 
                stroke="url(#gradientLine)" 
                strokeWidth="3" 
                strokeDasharray="8 8" 
                fill="none" 
              />
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Process Steps */}
          <div className="flex flex-col lg:flex-row justify-between items-center w-full z-10 gap-16 lg:gap-8">
            {processSteps.map((item, index) => (
              <div 
                key={item.id} 
                className={`relative flex flex-col items-center text-center w-full lg:w-1/3 ${item.offset} group`}
              >
                {/* Connecting Arrow for Mobile */}
                {index !== processSteps.length - 1 && (
                  <div className="absolute -bottom-10 lg:hidden text-slate-700">
                    <ArrowDownToLine size={24} />
                  </div>
                )}

                {/* Number Badge */}
                <div className="absolute -top-4 -right-2 w-10 h-10 bg-slate-800 text-white font-bold rounded-full flex items-center justify-center border-2 border-slate-950 z-20 shadow-lg">
                  {item.id}
                </div>

                {/* Circle Icon Container */}
                <div className="w-32 h-32 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-8 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all duration-500 relative z-10 overflow-hidden">
                  {/* Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                  {item.icon}
                </div>
                
                {/* Step Content */}
                <div className="bg-slate-900/40 border border-white/5 px-8 py-6 rounded-2xl backdrop-blur-md w-full max-w-[280px]">
                  <div className="flex items-center justify-center text-slate-400 text-xs font-bold tracking-widest uppercase mb-3">
                    {item.stepText} 
                  </div>
                  <h3 className="text-white font-black text-xl uppercase tracking-wide">
                    {item.actionText}
                  </h3>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowToInvest;