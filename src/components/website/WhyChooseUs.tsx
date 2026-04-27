import React, { useRef, useState } from 'react';
// Import your background asset here with a temporary name
import featureBgImage from '../../assets/images/header/choose-bg.jpg';

const WhyChooseUs = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Expanded Array for Grid Generation Logic
  const features = [
    {
      id: 1,
      title: 'DAILY INCOME',
      description: 'Receive consistent daily returns on your strategic investments with our high-margin systems.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 0l-2-2m2 2l2-2"></path></svg>
    },
    {
      id: 2,
      title: 'FASTEST PAYMENTS',
      description: 'Experience lightning-fast withdrawals processed automatically to your preferred method.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    },
    {
      id: 3,
      title: 'EASY TO USE',
      description: 'Our intuitive dashboard makes managing your portfolio simple, even for beginners.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
    },
    {
      id: 4,
      title: 'HIGH SECURITY',
      description: 'Bank-grade encryption and multi-layer protocols keep your funds and data safe.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    },
    {
      id: 5,
      title: '24/7 SUPPORT',
      description: 'Our global support team is available around the clock to assist you with any inquiries.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
    },
    {
      id: 6,
      title: 'GLOBAL ACCESS',
      description: 'Invest and monitor your assets from anywhere in the world, on any device.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    },
    {
      id: 7,
      title: 'EXPERT TEAM',
      description: 'Benefit from strategies developed by industry veterans in high-margin sports investments.',
      icon: <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
    }
  ];

  // --- Carousel Logic ---
  
  // Update active dot based on scroll position
  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.children[0].offsetWidth + 24; // Card width + gap (24px for gap-6)
      const newActiveIndex = Math.round(scrollPosition / cardWidth);
      setActiveIndex(newActiveIndex);
    }
  };

  // Click handler to scroll to a specific card
  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.children[0].offsetWidth + 24;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  // Next/Prev button handlers
  const scrollNext = () => {
    if (activeIndex < features.length - 1) scrollToIndex(activeIndex + 1);
  };

  const scrollPrev = () => {
    if (activeIndex > 0) scrollToIndex(activeIndex - 1);
  };

  return (
    <section 
      id="features" 
      className="w-full py-16 lg:py-24 bg-cover bg-center bg-no-repeat relative bg-[#f4f7fb]"
      style={{ backgroundImage: `url(${featureBgImage})` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h4 className="text-[#1e1545] font-semibold text-sm sm:text-base md:text-lg mb-2">
            Boost Your Money
          </h4>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#c61e3d] uppercase tracking-wide mb-4 md:mb-6">
            WHY SHOULD CHOOSE US?
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed px-2">
            Our service gives you better results and savings as per your requirements. You can manage your investments from anywhere—either from home or the workplace, at any time.
          </p>
        </div>

        {/* Carousel / Cards Grid */}
        {/* Added standard padding-bottom to avoid box-shadow clipping */}
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory hide-scrollbar"
        >
          {features.map((feature) => (
            <div 
              key={feature.id} 
              // w-[85vw] on mobile ensures the next card peeks into view
              className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 md:p-8 flex flex-col items-center text-center w-[85vw] sm:w-[280px] md:w-[320px] snap-center transform transition-transform hover:-translate-y-2 duration-300 flex-shrink-0"
            >
              <div className="text-[#b91c1c] mb-4 md:mb-6">
                {feature.icon}
              </div>
              <h3 className="text-gray-800 font-bold text-base md:text-lg uppercase tracking-wide mb-3 md:mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Carousel Controls */}
        <div className="flex items-center justify-center space-x-4 md:space-x-6 mt-2 md:mt-4">
          
          {/* Left Arrow */}
          <button 
            onClick={scrollPrev}
            disabled={activeIndex === 0}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
              activeIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-[#c61e3d]'
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          {/* Pagination Dots */}
          <div className="flex space-x-1.5 sm:space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'bg-[#f97316] w-5 sm:w-6' : 'bg-gray-400 hover:bg-gray-600 w-2 sm:w-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={scrollNext}
            disabled={activeIndex === features.length - 1}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
              activeIndex === features.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-[#c61e3d]'
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

      </div>
      
      {/* Hide scrollbar for webkit browsers for a cleaner look */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;