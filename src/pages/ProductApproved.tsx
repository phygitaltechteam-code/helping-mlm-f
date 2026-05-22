import GenericTable from '@/components/Forms/Table/GenericTable';
import React from 'react';
import { Column } from '@/types';

type Product = {
  crn: string;
  name: string;
  mobile: string;
  product: string;
  deliveryDate: string;
  status: string;
};

export const ProductApproved = () => {
  const products: Product[] = [
    {
      crn: 'CRN4956396',
      name: 'Product A',
      mobile: 'Category 1',
      product: 'Product A',
      deliveryDate: '2024-06-01',
      status: 'Pending', // Changed to Pending for context
    },
    {
      crn: 'CRN4956397',
      name: 'Product B',
      mobile: 'Category 2',
      product: 'Product B',
      deliveryDate: '2024-06-05',
      status: 'Pending',
    },
    {
      crn: 'CRN4956398',
      name: 'Product C',
      mobile: 'Category 1',
      product: 'Product C',
      deliveryDate: '2024-06-10',
      status: 'Approved',
    },
  ];

  // 1. Create a handler function for the button click
  const handleConfirmApprove = (crn: string) => {
    // Replace this with your actual API call or state update logic
    alert (`Status change confirmed and approved for CRN: ${crn}`);
  };

  // 2. Add the Action column with a custom 'render' function
  const productCol: Column<Product>[] = [
    { header: 'CRN', accessor: 'crn' },
    { header: 'Name', accessor: 'name' },
    { header: 'Mobile', accessor: 'mobile' },
    { header: 'Product', accessor: 'product' },
    { header: 'Delivery Date', accessor: 'deliveryDate' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Action',
      accessor: 'crn', // Depending on your types, an accessor might still be required
      // The 'render' property allows you to inject custom React nodes into the table cell
      render: (product: Product) => (
        <button
          onClick={() => handleConfirmApprove(product.crn)}
          disabled={product.status === 'Approved'}
          className={`px-3 py-1 text-sm rounded text-white ${
            product.status === 'Approved'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-secondary hover:bg-secondary/90'
          }`}
        >
          {product.status === 'Approved' ? 'Approved' : 'Confirm'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className='pt-3'>
        <GenericTable
          title="Product Approved List"
          data={products}
          columns={productCol}
          itemsPerPage={15}
          searchAble
        />
      </div>
    </div>
  );
};