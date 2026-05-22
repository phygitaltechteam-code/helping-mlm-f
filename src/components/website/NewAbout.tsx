import React from 'react';
import { Shield, Zap, Target, Eye, Maximize, CheckCircle2, Play } from 'lucide-react';
import aboutSideImage from '../../assets/images/header/newabout-bg.jpg';

const About = () => {
    const features = [
        { id: 1, title: 'EFFICIENCY', icon: <Zap className="w-6 h-6 text-emerald-400" />, color: 'group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30' },
        { id: 2, title: 'EXPERIENCE', icon: <Target className="w-6 h-6 text-blue-400" />, color: 'group-hover:bg-blue-500/10 group-hover:border-blue-500/30' },
        { id: 3, title: 'SECURITY', icon: <Shield className="w-6 h-6 text-purple-400" />, color: 'group-hover:bg-purple-500/10 group-hover:border-purple-500/30' },
        { id: 4, title: 'TRANSPARENT', icon: <Eye className="w-6 h-6 text-cyan-400" />, color: 'group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30' },
        { id: 5, title: 'SIMPLE', icon: <Maximize className="w-6 h-6 text-amber-400" />, color: 'group-hover:bg-amber-500/10 group-hover:border-amber-500/30' },
        { id: 6, title: 'COMPLIANT', icon: <CheckCircle2 className="w-6 h-6 text-rose-400" />, color: 'group-hover:bg-rose-500/10 group-hover:border-rose-500/30' }
    ];

    return (
        <section id="about" className="w-full py-24 bg-slate-950 overflow-hidden relative">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Left Column: Text and Features Grid */}
                    <div className="w-full lg:w-[55%] flex flex-col">
                        
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md w-max">
                           <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Welcome happily Life</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
                            A Few Words <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">About Us</span>
                        </h2>

                        <p className="text-white text-lg md:text-xl leading-relaxed mb-4 font-medium">
                            To meet <span className="text-emerald-400">today's market challenges,</span> we have developed a unique and advanced fund management system.
                        </p>
                        
                        <p className="text-slate-400 leading-relaxed mb-12 text-base font-light">
                            ARC International is a private financial company specializing in sports betting-based investment strategies. Our system is designed to significantly reduce risk through the continuous development and enhancement of a semi-automatic betting model. We have upgraded our automated system so that the final step before placing any bet is carefully reviewed and executed by our professional operators.
                        </p>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {features.map((feature) => (
                                <div key={feature.id} className={`group flex flex-col items-center justify-center p-6 bg-slate-900/50 border border-white/5 rounded-2xl transition-all duration-300 ${feature.color}`}>
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                        {feature.icon}
                                    </div>
                                    <span className="text-slate-300 group-hover:text-white font-bold text-xs tracking-widest uppercase transition-colors">
                                        {feature.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Image with Play Button */}
                    <div className="w-full lg:w-[45%] relative">
                        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                            
                            {/* Gradient Overlay for Image */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
                            
                            <img
                                src={aboutSideImage}
                                alt="ARC International Concept"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop";
                                }}
                            />

                            {/* Floating Play Button */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="relative flex items-center justify-center w-20 h-20">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
                                    <button className="relative w-16 h-16 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.5)] hover:scale-110 transition-transform duration-300 text-slate-950 pl-1">
                                        <Play fill="currentColor" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute bottom-6 left-6 right-6 z-20 p-6 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/10">
                                <p className="text-white text-sm font-medium tracking-wide">
                                    "Balancing technology and human expertise ensures greater accuracy and consistency."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;