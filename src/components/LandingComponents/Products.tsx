
//FROM TMS CHANGED

import React from 'react';
import p  from '@/assets/images/product/product 1.jpg';
import p1 from '@/assets/images/banner/pad1.png';
import p2 from '@/assets/images/banner/pad3.png';
import p3 from '@/assets/images/product/Product 3.png';
import p4 from '@/assets/images/product/combo.png';

// import p4 from '@/assets/images/product/p4.jpg';
import p5 from '@/assets/images/product/p5.jpeg';

const Products: React.FC = () => {
  // Product data
  const products = [
     {
      name: 'Happily Parsana Acupressure Therapy Plate',
      image: p,
      price:'2000 rs 1 plate'
    },
    {
      name: 'Happily Pad',
      image: p1,
      price:' 2500 rs  20 box'
    },
   
    {
      name: 'Combo Pack',
      image: p4,
      price:'3000 rs'
    },
   
  ];

  return (
    <div className="p-6">
      <h1 className="title-font text-purple mb-8 text-center text-2xl font-semibold sm:text-3xl">
        Products
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-4 text-center shadow-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="mb-4 h-80 w-full rounded-md object-contain"
            />
            <h2 className="text-lg font-semibold text-black">
              {product.name}

              <p>Price: {product.price}</p>

            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
