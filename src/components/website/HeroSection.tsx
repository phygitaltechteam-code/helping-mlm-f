import React, { useState, useEffect } from 'react';
// Import your assets here with temporary names as requested
import logoImage from '../../assets/images/header/logo.png';
import bgImage from '../../assets/images/header/header-bg.jpg';
import { useNavigate } from '@tanstack/react-router';

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Effect to handle the scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Grid Generation Data
  const statsData = [
    {
      id: 1,
      value: "36,967,030",
      label: "Registered Users",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    },
    {
      id: 2,
      value: "178",
      label: "Countries Supported",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    },
    {
      id: 3,
      value: "10,800,000",
      label: "Withdrawn Each Month",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    },
    {
      id: 4,
      value: "1,800,000",
      label: "Active Investors Daily",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    }
  ];

  const navLinks = ["HOME", "ABOUT", "PLANS", "BLOG", "CONTACT", "LOGIN", "REGISTER"];

  // Helper for navigation logic
  const handleNavigation = (link) => {
    if (link === "LOGIN") {
      navigate({ to: "/signin" });
    }
    // Close mobile menu after clicking a link
    setIsMobileMenuOpen(false);
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col justify-between bg-cover bg-center bg-no-repeat pt-24"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Deep Purple/Blue Overlay */}
      <div className="absolute inset-0 bg-[#2a1e5c]/80 z-0"></div>

      {/* Top Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white shadow-lg h-20 text-[#1e1545]'
            : 'bg-transparent h-24 text-white'
          }`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 h-full relative">
          
          {/* Logo Section */}
          <div className="flex items-center z-50">
            <div className={`relative p-2 rounded-full border-2 transition-colors duration-300 ${isScrolled ? 'border-[#1e1545] bg-white' : 'border-white bg-white'} h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center overflow-hidden`}>
              <img
                src={logoImage}
                alt="ARC International Logo"
                className="w-[120%] h-[120%] max-w-none object-contain"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-xs lg:text-sm font-semibold tracking-wide">
            {navLinks.map((link) => (
              <a
                key={link}
                onClick={() => handleNavigation(link)}
                className="hover:text-[#ff6b00] transition-colors duration-200 cursor-pointer"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`block w-7 h-0.5 transition-transform duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-[#1e1545]' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-7 h-0.5 transition-opacity duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-[#1e1545]' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-7 h-0.5 transition-transform duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-[#1e1545]' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        <div 
          className={`absolute top-full left-0 w-full bg-white shadow-xl overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'}`}
        >
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link}
                onClick={() => handleNavigation(link)}
                className="text-[#1e1545] font-semibold text-sm tracking-wide hover:text-[#ff6b00] transition-colors duration-200 cursor-pointer"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 flex-grow pt-16 md:pt-10">
        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-light tracking-widest uppercase">
          Take Your
        </h2>
        
        {/* Adjusted text sizing curve so it doesn't overflow mobile */}
        <h1 className="text-[#ff6b00] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-wider uppercase mt-2 leading-tight">
          Investment Strategy
        </h1>
        
        <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-medium tracking-wide uppercase mt-2">
          To The Next Level
        </h2>
        
        <p className="text-gray-200 text-sm sm:text-base md:text-xl max-w-3xl mt-6 md:mt-8 font-light leading-relaxed">
          A profitable platform for high-margin sports investments, powered by advanced strategies and global e-commerce solutions by ARC International.
        </p>

        <button className="mt-8 md:mt-10 px-8 md:px-10 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-red-700 to-red-500 rounded-full text-white font-bold tracking-wider border-2 border-orange-500 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,107,0,0.5)]">
          GET STARTED NOW!
        </button>
      </div>

      {/* Dynamic Statistics Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pb-12 pt-16 md:pt-20 px-4">
        {/* Using standard gap rules instead of complex inner-border logic for a cleaner responsive stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 lg:divide-x lg:divide-white/20">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 lg:bg-transparent lg:rounded-none backdrop-blur-sm lg:backdrop-blur-none"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10 text-[#ff6b00] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {stat.icon}
              </svg>
              {/* Scaled the stat value size down slightly for mobile */}
              <span className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-1 tracking-tight">{stat.value}</span>
              <span className="text-[#ff6b00] text-[10px] md:text-xs font-semibold tracking-wider uppercase text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;