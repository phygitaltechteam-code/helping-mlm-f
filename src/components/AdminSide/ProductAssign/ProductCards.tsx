/* eslint-disable */
import React from 'react';

type Product = {
  id: string;
  name: string;
  discountedPrice: number;
  images: string;
};

type Props = {
    products: Product[];
    selected: string[];
    onSelect: (id: string) => void;
};

const ProductCards: React.FC<Props> = ({ products, selected, onSelect }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {products.map((product) => {
                const isSelected = selected.includes(product.id);

                return (
                    <div
                        key={product.id}
                        onClick={() => onSelect(product.id)}
                        className={`border p-4 rounded cursor-pointer transition 
        ${isSelected ? 'bg-blue-200 border-blue-500' : 'bg-white'}`}
                    >
                        <img
                            src={product.images}
                            alt={product.name}
                            className="w-full h-32 object-cover mb-2 rounded"
                        />

                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">₹{product.discountedPrice}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductCards;