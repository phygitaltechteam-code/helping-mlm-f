import React, { useState } from 'react';

const ProfitCalculator = () => {
  // State to hold the user's input and selected plan
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(0.02); // Default to 2%

  // Calculations
  const numericAmount = parseFloat(amount) || 0;
  const dailyProfit = (numericAmount * percentage).toFixed(2);
  const weeklyProfit = (numericAmount * percentage * 7).toFixed(2);
  const monthlyProfit = (numericAmount * percentage * 30).toFixed(2); // Assuming 30-day month

  return (
    <div className="w-full bg-[#241d4e] py-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Side: Input Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-1/2">
          
          {/* Calculator/Invoice Icon Placeholder */}
          <div className="text-white hidden md:block">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 14h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18v.01M8 18v.01M16 18v.01M12 14v.01M8 14v.01M16 14v.01"></path>
            </svg>
          </div>

          <div className="flex flex-col w-full">
            <label className="text-white text-sm tracking-wider uppercase mb-3 text-center md:text-left">
              Enter Investment Amount
            </label>
            
            {/* Input and Select Wrapper */}
            <div className="flex items-center rounded-full border border-white/30 bg-[#2a225c] focus-within:border-white/60 transition-colors w-full">
              <input
                type="number"
                placeholder="$200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-gray-300 px-6 py-3 md:py-4 outline-none w-full min-w-0"
              />
              
              <div className="relative">
                <select 
                  className="appearance-none bg-gradient-to-r from-purple-700 to-red-600 text-white font-medium px-6 pr-10 py-3 md:py-4 rounded-full outline-none cursor-pointer whitespace-nowrap"
                  value={percentage}
                  onChange={(e) => setPercentage(parseFloat(e.target.value))}
                >
                  <option value={0.01} className="bg-[#241d4e]">1% Daily For Ever</option>
                  <option value={0.02} className="bg-[#241d4e]">2% Daily For Ever</option>
                  <option value={0.03} className="bg-[#241d4e]">3% Daily For Ever</option>
                </select>
                {/* Custom Dropdown Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Output Section */}
        <div className="flex justify-between items-center w-full lg:w-1/2 px-4 md:px-0 mt-6 lg:mt-0">
          
          {/* Daily Profit */}
          <div className="flex flex-col items-center">
            <span className="text-[#d80032] text-5xl font-bold mb-2">{numericAmount ? dailyProfit : '0'}</span>
            <span className="text-white text-xs md:text-sm tracking-wider uppercase">Daily Profit</span>
          </div>

          {/* Weekly Profit */}
          <div className="flex flex-col items-center">
            <span className="text-[#d80032] text-5xl font-bold mb-2">{numericAmount ? weeklyProfit : '0'}</span>
            <span className="text-white text-xs md:text-sm tracking-wider uppercase">Weekly Profit</span>
          </div>

          {/* Monthly Profit */}
          <div className="flex flex-col items-center">
            <span className="text-[#d80032] text-5xl font-bold mb-2">{numericAmount ? monthlyProfit : '0'}</span>
            <span className="text-white text-xs md:text-sm tracking-wider uppercase">Monthly Profit</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;