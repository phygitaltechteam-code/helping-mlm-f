//FROM TMS CHANGED

import React from 'react';
import p from '@/assets/images/product/product 1.jpg';
import p1 from '@/assets/images/banner/pad1.png';
import p2 from '@/assets/images/banner/pad3.png';
import p3 from '@/assets/images/product/Product 3.png';
import p4 from '@/assets/images/product.png';

// import p4 from '@/assets/images/product/p4.jpg';
import p5 from '@/assets/images/product/p5.jpeg';

const Products: React.FC = () => {
  // Product data with corrected prices
  const products = [
    {
      name: 'Happily Parsana Acupressure Therapy Plate',
      image: p,
      originalPrice: 2500,
      offerPrice: 2300,
    },
    {
      name: 'Happily Sanitary Napkin',
      image: p1,
      originalPrice: 4000,
      offerPrice: 3200,
      packSize: '20 Box',
    },
    {
      name: 'Happily Sanitary Napkin',
      image: p2,
      originalPrice: 2500,
      offerPrice: 2300,
      packSize: '10 Box',
    },
    {
      name: 'Happily Millionaire Bracelet Combo Pack',
      image: p4,
      originalPrice: 3200,
      offerPrice: 3000,

      description:
        'Includes Sanitary Napkins + N Mother Care + Millionaire Bracelet',
      features: [
        'Premium Quality Sanitary Napkins',
        'N Mother Care Product',
        'Happily Millionaire Bracelet',
        'Complete Wellness Package',
      ],
    },
  ];

  return (
    <div className="w-full overflow-x-auto px-4 py-6">
      <h1 className="title-font mb-8 text-center text-2xl font-semibold text-black sm:text-3xl">
        Products
      </h1>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:overflow-x-visible">
        {products.map((product, index) => (
          <div
            key={index}
            className="min-w-[280px] flex-shrink-0 rounded-lg bg-white p-4 text-center shadow-lg transition-transform duration-300 hover:scale-105 md:min-w-0"
          >
            <img
              src={product.image}
              alt={product.name}
              className="mb-4 h-64 w-full rounded-md object-contain"
            />
            <h2 className="line-clamp-2 text-lg font-semibold text-black">
              {product.name}
            </h2>
  
            <p className="text-gray-600 mt-1 text-sm">{product.packSize}</p>
            {/* Actual Price - No strikethrough */}
            <div className="mt-2">
              <span className="text-gray-600 text-base font-medium">
              Actual Price: ₹{product.originalPrice.toLocaleString()}
              </span>
            </div>
            
            {/* Offer Price */}
            <div className="mt-1">
              <span className="text-lg font-bold text-primary">
                Offer Price: ₹{product.offerPrice.toLocaleString()}
              </span>
            </div>
            
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;