import React from 'react';
// Import your map background asset here
import mapBgImage from '../../assets/images/header/invest-bg.jpg'; 

const HowToInvest = () => {
  // Array to map over the steps, keeping the logic clean
  const processSteps = [
    {
      id: 1,
      stepText: 'FIRST STEP',
      actionText: 'SING UP',
      verticalOffset: 'mt-16 md:mt-24', 
      icon: (
        <svg className="w-12 h-12 text-[#c61e3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: 2,
      stepText: 'SECOND STEP',
      actionText: 'MAKE A DEPOSIT',
      verticalOffset: 'mb-16 md:mb-24',
      icon: (
        <svg className="w-12 h-12 text-[#c61e3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 3,
      stepText: 'THIRD STEP',
      actionText: 'WITHDRAW',
      verticalOffset: 'mt-16 md:mt-24',
      icon: (
        <svg className="w-12 h-12 text-[#c61e3d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      
      {/* Background Map Image Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-center bg-no-repeat bg-contain md:bg-cover"
        style={{ backgroundImage: `url(${mapBgImage})` }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Text Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h4 className="text-[#1e1545] font-semibold text-xl mb-2">
            How You Can Invest Your
          </h4>
          <h2 className="text-4xl md:text-6xl font-bold text-[#c61e3d] uppercase tracking-wide mb-6">
            MONEY MORE SMARTLY
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            It's a simple way to start invest.You don't need a deep wallet to start behoof.
            <br className="hidden md:block" /> Pick an amount you can afford, and build your behoof over time.
          </p>
        </div>

        {/* Steps and Dashed Line Container */}
        <div className="relative w-full flex justify-center items-center mt-10">
          
          {/* Background Dashed Wavy Line */}
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 hidden md:block z-0 pointer-events-none">
            <svg width="100%" height="200" viewBox="0 0 1000 200" fill="none" preserveAspectRatio="none">
              <path 
                d="M -50 150 Q 150 250 300 100 T 700 100 T 1050 50" 
                stroke="#ff7a7a" 
                strokeWidth="2" 
                strokeDasharray="10 10" 
                fill="none" 
              />
            </svg>
            <div className="absolute top-0 right-0 transform -translate-y-6 text-[#c61e3d]">
              <svg className="w-12 h-12 transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>

          {/* Process Steps */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl z-10">
            {processSteps.map((item) => (
              <div 
                key={item.id} 
                className={`flex flex-col items-center text-center ${item.verticalOffset} mb-12 md:mb-0`}
              >
                {/* Circle Icon Container */}
                <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(0,0,0,0.08)] mb-8 hover:scale-105 transition-transform duration-300 border border-gray-50">
                  {item.icon}
                </div>
                
                {/* Step Subtitle */}
                <div className="flex items-center text-gray-500 text-sm font-semibold tracking-widest uppercase mb-2">
                  {item.stepText} 
                  <svg className="w-5 h-5 ml-2 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                
                {/* Action Text */}
                <h3 className="text-[#e65c00] font-bold text-xl uppercase tracking-wide">
                  {item.actionText}
                </h3>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowToInvest;