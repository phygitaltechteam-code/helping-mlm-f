import React from 'react';
import ProductAssignForm from '@/components/AdminSide/ProductAssign/ProductAssignForm';

const ProductAssignPage = () => {
  return (
    <div className="mx-auto max-w-270">
      <div className="grid grid-cols-8 gap-8">
        <div className="col-span-8">
          <ProductAssignForm />
        </div>
      </div>
    </div>
  );
};

export default ProductAssignPage;