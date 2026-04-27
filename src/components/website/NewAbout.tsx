import React from 'react';
// Import your assets here with temporary names
import aboutSideImage from '../../assets/images/header/newabout-bg.jpg';

const About = () => {
    // Array to handle the grid generation logic efficiently
    const features = [
        {
            id: 1,
            title: 'EFFICIENCY',
            iconColor: 'text-purple-600',
            bgGlow: 'bg-purple-100 shadow-[0_0_15px_rgba(147,51,234,0.4)]',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
        },
        {
            id: 2,
            title: 'EXPIERENCE', // Note: Check spelling (EXPERIENCE)
            iconColor: 'text-blue-500',
            bgGlow: 'bg-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
        },
        {
            id: 3,
            title: 'SECURITY',
            iconColor: 'text-orange-500',
            bgGlow: 'bg-orange-100 shadow-[0_0_15px_rgba(249,115,22,0.4)]',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
        },
        {
            id: 4,
            title: 'TRANSPARENT',
            iconColor: 'text-pink-500',
            bgGlow: 'bg-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.4)]',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        },
        {
            id: 5,
            title: 'SIMPLE',
            iconColor: 'text-indigo-500',
            bgGlow: 'bg-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.4)]',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path></svg>
        },
        {
            id: 6,
            title: 'COMPLIANT',
            iconColor: 'text-fuchsia-500',
            bgGlow: 'bg-fuchsia-100 shadow-[0_0_15px_rgba(217,70,239,0.4)]',
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        }
    ];

    return (
        <section id="about" className="w-full py-12 md:py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto lg:ml-40 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">

                    {/* Left Column: Text and Features Grid */}
                    <div className="w-full lg:w-1/2 flex flex-col pr-0 lg:pr-8">

                        {/* Header Texts */}
                        <h4 className="text-gray-800 font-semibold tracking-wider text-sm uppercase mb-2 text-center lg:text-left">
                            WELCOME TO ARC INTERNATIONAL
                        </h4>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#c61e3d] mb-6 uppercase tracking-wide text-center lg:text-left">
                            A FEW WORDS ABOUT US
                        </h2>

                        {/* Paragraph Text */}
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4 text-center lg:text-left">
                            To meet <span className="text-[#f97316]">today's market challenges,</span> we have developed a unique and advanced fund management system.
                        </p>
                        <p className="text-gray-500 leading-relaxed mb-10 text-sm sm:text-base text-center lg:text-left">
                            ARC International is a private financial company specializing in sports betting-based investment strategies. Our system is designed to significantly reduce risk through the continuous development and enhancement of a semi-automatic betting model. We have upgraded our automated system so that the final step before placing any bet is carefully reviewed and executed by our professional operators. This balance of technology and human expertise ensures greater accuracy, control, and consistency in performance.
                        </p>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-10 gap-x-6">
                            {features.map((feature) => (
                                <div key={feature.id} className="flex flex-col items-center text-center">
                                    {/* Icon Circle */}
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 ${feature.bgGlow}`}>
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center ${feature.iconColor}`}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    {/* Title */}
                                    <span className="text-gray-800 font-bold text-xs sm:text-sm tracking-widest uppercase">
                                        {feature.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Image with Play Button */}
                    <div className="w-full lg:w-1/2 relative flex justify-center mt-12 lg:mt-0">
                        <div className="relative w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
                            {/* Main Graphic */}
                            <img
                                src={aboutSideImage}
                                alt="Abstract Sports Figure"
                                className="w-full lg:w-[120%] h-auto object-cover z-10 relative lg:-right-[10%] rounded-2xl lg:rounded-none"
                            />

                            {/* Floating Play Button Overlay */}
                            <button className="absolute top-1/2 left-1/2 lg:top-[60%] lg:left-auto lg:right-[30%] z-20 transform -translate-x-1/2 -translate-y-1/2 lg:translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-[#e65c00] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(230,92,0,0.5)] hover:scale-110 transition-transform duration-300 border-2 border-white">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;