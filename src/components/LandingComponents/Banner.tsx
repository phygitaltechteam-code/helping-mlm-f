import React, { useState, useEffect, Suspense } from 'react';
import Loader from '../common/Loader';

// Import your 3 images
import pad3 from '@/assets/images/banner/pad3.png';
import pad4 from '@/assets/images/banner/pad4.png';

const Banner: React.FC = () => {
  const images = [pad3, pad4];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality (changes slide every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(timer);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <section id="home">
        <div className="grid gap-4 md:mt-20 mt-3">
          <Suspense fallback={<Loader />}>
            
            {/* Carousel Container */}
            <div className="relative w-full overflow-hidden group">
              
              {/* Images Wrapper with Slide Animation */}
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
               {images.map((image, index) => (
  <img
    key={index}
    src={image}
    alt={`slide-${index + 1}`}
    // Changed this line to match your previous sizing
    className="h-auto max-w-full w-full flex-shrink-0 object-contain"
  />
))}
              </div>

              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

            </div>
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default Banner;