//FROM TMS CHANGED

import React, { useState } from 'react';
import customer1 from '@/assets/images/customer1.jpeg';
import customer2 from '@/assets/images/customer2.jpeg';
import customer3 from '@/assets/images/customer3.jpeg';
import customer4 from '@/assets/images/customer4.jpeg';
import customer5 from '@/assets/images/customer5.jpeg';
import customer6 from '@/assets/images/customer6.jpeg';

const Trial = () => {
  const images = [customer1, customer2, customer3, customer4, customer5, customer6];
  const [currentIndex, setCurrentIndex] = useState(0);

  // For mobile: show 1 card, for desktop: show 2 cards
  const getCardsToShow = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 1 : 2;
    }
    return 2;
  };

  const [cardsToShow, setCardsToShow] = useState(2);

  React.useEffect(() => {
    const handleResize = () => {
      const newCardsToShow = window.innerWidth < 768 ? 1 : 2;
      setCardsToShow(newCardsToShow);
      // Reset index when switching between 1 and 2 cards
      setCurrentIndex(0);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + cardsToShow) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - cardsToShow;
      if (newIndex < 0) {
        // If going back from first slides, jump to last set
        const totalSets = Math.ceil(images.length / cardsToShow);
        return (totalSets - 1) * cardsToShow;
      }
      return newIndex;
    });
  };

  const visibleImages = () => {
    const visible = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % images.length;
      visible.push(images[index]);
    }
    return visible;
  };

  const testimonialTexts = [
    "The acupressure plate has relieved my back pain significantly! Feeling much better after daily use.",
    "Amazing product! My sleep quality has improved and stress levels have reduced dramatically.",
    "Best investment for my health! My headaches and neck pain are almost gone now.",
    "Life-changing therapy plate! My energy levels are up and body feels more relaxed.",
    "Highly recommend HappilyLife! The quality and results are truly remarkable.",
    "This product exceeded my expectations! My overall wellness has improved tremendously."
  ];

  // Get the index of the actual image for testimonial text
  const getActualIndex = (visibleIdx) => {
    return (currentIndex + visibleIdx) % images.length;
  };

  return (
    <section className="bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="text-center mb-8">
            <p className="text-gray-600 font-pj text-lg font-medium">
              2,157 people have said how good HappilyLife
            </p>
            <h2 className="font-pj mt-2 text-3xl font-bold text-black sm:text-4xl xl:text-5xl">
              Our happy clients say about us
            </h2>
          </div>

          <div className="relative w-full">
            <div className="relative mx-auto max-w-5xl">
              <div className="relative flex items-center justify-center">
                <button
                  onClick={prevSlide}
                  className="absolute -left-4 md:-left-16 z-10 rounded-full bg-white p-2 md:p-3 shadow-lg hover:bg-gray-100 transition-all"
                >
                  <svg className="h-4 w-4 md:h-6 md:w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-4 md:gap-8 justify-center px-8 md:px-0">
                  {visibleImages().map((image, idx) => {
                    const actualIndex = getActualIndex(idx);
                    return (
                      <div key={idx} className="flex flex-col overflow-hidden shadow-xl w-72 md:w-80">
                        <div className="flex flex-1 flex-col justify-between bg-white p-4 md:p-6">
                          <div className="flex-1">
                            <div className="flex items-center justify-center bg-gray-50 rounded-lg">
                              <img
                                className="w-40 h-40 md:w-48 md:h-48 object-contain"
                                src={image}
                                alt={`Customer ${actualIndex + 1}`}
                              />
                            </div>

                            <blockquote className="mt-4 md:mt-6 flex-1 text-center">
                              <p className="text-gray-600 font-pj text-xs md:text-sm leading-relaxed">
                                "{testimonialTexts[actualIndex]}"
                              </p>
                            </blockquote>
                          </div>

                          <div className="mt-3 md:mt-6 text-center">
                            <p className="font-pj text-gray-500 text-xs">
                              ⭐⭐⭐⭐⭐
                            </p>
                            <p className="font-pj text-gray-600 mt-1 text-xs">
                              Verified User
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={nextSlide}
                  className="absolute -right-4 md:-right-16 z-10 rounded-full bg-white p-2 md:p-3 shadow-lg hover:bg-gray-100 transition-all"
                >
                  <svg className="h-4 w-4 md:h-6 md:w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 flex justify-center gap-2">
                {[...Array(Math.ceil(images.length / cardsToShow))].map((_, idx) => {
                  const isActive = Math.floor(currentIndex / cardsToShow) === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx * cardsToShow)}
                      className={`h-2 rounded-full transition-all ${
                        isActive ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trial;