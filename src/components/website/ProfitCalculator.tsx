import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ChevronDown } from 'lucide-react';

const ProfitCalculator = () => {
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(0.02); // Default to 2%

  const numericAmount = parseFloat(amount) || 0;
  const dailyProfit = (numericAmount * percentage).toFixed(2);
  const weeklyProfit = (numericAmount * percentage * 7).toFixed(2);
  const monthlyProfit = (numericAmount * percentage * 30).toFixed(2); 

  return (
    <div className="w-full bg-slate-950 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Profit</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Estimate your potential returns instantly with our automated high-margin investment strategies.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 shadow-2xl">
          
          {/* Left Side: Input Section */}
          <div className="flex flex-col w-full lg:w-1/2">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400">
                <Calculator size={32} />
              </div>
              <div>
                <h3 className="text-white text-xl font-bold tracking-wide">Investment Setup</h3>
                <p className="text-slate-400 text-sm">Enter your capital and select a plan</p>
              </div>
            </div>

            <div className="space-y-6 mt-4">
              <div>
                <label className="text-slate-300 text-xs tracking-widest uppercase font-semibold mb-3 block">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg font-medium">$</span>
                  <input
                    type="number"
                    placeholder="1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 focus:border-emerald-500/50 rounded-2xl text-white px-12 py-4 outline-none transition-colors font-medium text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs tracking-widest uppercase font-semibold mb-3 block">
                  Investment Plan
                </label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-slate-900/50 border border-white/10 focus:border-emerald-500/50 rounded-2xl text-white px-6 py-4 outline-none transition-colors font-medium cursor-pointer"
                    value={percentage}
                    onChange={(e) => setPercentage(parseFloat(e.target.value))}
                  >
                    <option value={0.01} className="bg-slate-900 text-white">1% Daily Forever</option>
                    <option value={0.02} className="bg-slate-900 text-white">2% Daily Forever</option>
                    <option value={0.03} className="bg-slate-900 text-white">3% Daily Forever</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center text-slate-400">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Output Section */}
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500/30 transition-colors">
              <span className="text-slate-400 text-xs tracking-widest uppercase font-semibold mb-2">Daily</span>
              <span className="text-emerald-400 text-3xl font-black">${numericAmount ? dailyProfit : '0.00'}</span>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-emerald-500/30 transition-colors">
              <span className="text-slate-400 text-xs tracking-widest uppercase font-semibold mb-2">Weekly</span>
              <span className="text-emerald-400 text-3xl font-black">${numericAmount ? weeklyProfit : '0.00'}</span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(52,211,153,0.1)]">
              <span className="text-emerald-300 text-xs tracking-widest uppercase font-semibold mb-2">Monthly</span>
              <span className="text-white text-4xl font-black">${numericAmount ? monthlyProfit : '0.00'}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;