import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Users, Globe, DollarSign, Activity, Menu, X, ArrowRight } from 'lucide-react';

// Use the existing logo if available, or text fallback
import logoImage from '../../assets/images/header/logo.png';

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const statsData = [
    { id: 1, value: "36M+", label: "Registered Users", icon: <Users className="w-6 h-6 text-emerald-400" /> },
    { id: 2, value: "178", label: "Countries Supported", icon: <Globe className="w-6 h-6 text-blue-400" /> },
    { id: 3, value: "$10.8M", label: "Withdrawn Monthly", icon: <DollarSign className="w-6 h-6 text-amber-400" /> },
    { id: 4, value: "1.8M", label: "Active Investors", icon: <Activity className="w-6 h-6 text-purple-400" /> }
  ];

  const navLinks = ["HOME", "ABOUT", "PLANS", "BLOG", "CONTACT", "LOGIN", "REGISTER"];

  const handleNavigation = (link: string) => {
    if (link === "LOGIN" || link === "REGISTER") {
      navigate({ to: "/signin" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden pt-24 font-sans text-slate-50">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-xl h-20 shadow-2xl' : 'bg-transparent h-24'
      }`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full relative">
          
          {/* Logo Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center z-50 cursor-pointer">
             <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <img src={logoImage} alt="Logo" className="w-[80%] h-[80%] object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span className="absolute font-bold text-xl tracking-wider text-white mix-blend-overlay">ARC</span>
             </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-white/5 rounded-full px-2 py-1.5 backdrop-blur-md border border-white/10">
            {navLinks.map((link, i) => (
              <motion.a
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                key={link}
                onClick={() => handleNavigation(link)}
                className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium tracking-widest cursor-pointer transition-all duration-300 ${
                  link === 'LOGIN' || link === 'REGISTER' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:scale-105' 
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {link}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white p-2 z-50 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-xl border-b border-white/10 overflow-hidden transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link}
                onClick={() => handleNavigation(link)}
                className="text-slate-300 font-medium text-sm tracking-widest hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 flex-grow pt-16 md:pt-10">
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
           <span className="flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-xs font-semibold tracking-widest text-emerald-300 uppercase">Next Gen Platform</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-tight"
        >
          Elevate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Investment Strategy
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-slate-400 text-base md:text-lg lg:text-xl max-w-2xl mt-4 font-light leading-relaxed"
        >
          Discover a profitable platform for high-margin investments, powered by advanced automated strategies and global e-commerce solutions.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold tracking-widest text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            GET STARTED NOW <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold tracking-widest text-sm hover:bg-white/5 transition-colors">
            VIEW PLANS
          </button>
        </motion.div>
      </div>

      {/* Dynamic Statistics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 w-full max-w-7xl mx-auto pb-12 pt-16 px-4"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {statsData.map((stat) => (
            <div
              key={stat.id}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="mb-4 p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-1 tracking-tight">{stat.value}</span>
              <span className="text-slate-400 text-[10px] md:text-xs font-semibold tracking-widest uppercase text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;