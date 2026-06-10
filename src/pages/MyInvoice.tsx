/* eslint-disable */
import React from 'react';
import {useAuthContext} from '@/context/AuthContext';
import { useGetProductDataCustomer } from '@/lib/react-query/Customer/product';

interface InvoiceProps {
  createdAt?: string;
}

const MyInvoice: React.FC<InvoiceProps> = ({createdAt}) => {
  const {user} = useAuthContext();
  console.log('user', user);
  const {data: getproductdata} = useGetProductDataCustomer();
  console.log('getproductdata', getproductdata);
  
  const displayDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');

  if (!user) return <p className="py-8 text-center">No user data found</p>;

  // Extract only the number from CRN for receipt number and show only last 4 digits
  const getReceiptNumber = (crnNo: string) => {
    if (!crnNo) return '-';
    const numberOnly = crnNo.replace(/^CRN/i, '');
    // Show only last 4 digits
    return numberOnly.slice(-4);
  };

  // Get product data from API response
  const productData = getproductdata?.[0]?.product;
  const productName = productData?.name || '-';
  const discountedPrice = productData?.discountedPrice || 0;
  const actualPrice = productData?.actualPrice || 0;
  const productImage = productData?.images || '';

  // Calculate total amount
  const totalAmount = discountedPrice;

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border-4 border-primary/30 bg-white shadow-xl shadow-primary/10">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 text-center text-white">
          <h5 className="font-[Cambria] text-3xl font-bold tracking-widest">
            HAPPILYLIFE
          </h5>
        </div>

        {/* Receipt Info */}
        <div className="bg- px-6 py-3 text-right font-[Cambria] text-sm text-black">
          <p>Receipt No. : {getReceiptNumber(user?.crnNo || '')}</p>
          <p>Date : {displayDate}</p>
        </div>

        {/* Mailing + Bill Info */}
        <div className="grid grid-cols-1 gap-6 px-6 py-5 font-[Cambria] text-sm md:grid-cols-2">
          <div>
            <ul className="list-none space-y-2 text-black">
              <li>
                Mailing Info,
                <br />
                <b className="text-primary">Regional Office:</b>
                <br />
                HAPPILY LIFE
                <br />
                Flat No. S NO. 56 B wing Office No. 5 , Near Ambedkar Hotel ,
                Mantra Essence Commercial Pri , Pune, Maharashtra 411028
              </li>
            </ul>
          </div>

          <div className="border-primary/30 pl-4 md:border-l-2">
            <ul className="list-none space-y-1">
              <li className="font-semibold text-primary">Bill To,</li>
              <li>Member Code : {user.crnNo || '-'}</li>
              <li>Member Name : {user.fullname || '-'}</li>
              <li>Mobile No : {user.phoneNumber || '-'}</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-primary/20" />

        {/* Product Details Table */}
        <div className="px-6 py-4">
          <table className="w-full border-collapse font-[Cambria]">
            <thead>
              <tr className="border-b-2 border-primary/30 bg-primary/5">
                <th className="py-2 text-left text-sm font-semibold text-primary">Sr. No.</th>
                <th className="py-2 text-left text-sm font-semibold text-primary">Product Name</th>
                <th className="py-2 text-right text-sm font-semibold text-primary">Quantity</th>
                <th className="py-2 text-right text-sm font-semibold text-primary">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-primary/10">
                <td className="py-3 text-sm text-black">1</td>
                <td className="py-3 text-sm text-black">
                  {productName}
                  {productImage && (
                    <div className="mt-1">
                      <img 
                        src={productImage} 
                        alt={productName} 
                        className="h-12 w-12 rounded object-cover"
                      />
                    </div>
                  )}
                </td>
                <td className="py-3 text-right text-sm text-black">1</td>
                <td className="py-3 text-right text-sm font-medium text-primary">
                  ₹{discountedPrice.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-primary/30 bg-primary/5">
                <td colSpan={3} className="py-2 text-right font-semibold text-black">
                  Total Amount:
                </td>
                <td className="py-2 text-right text-lg font-bold text-primary">
                  ₹{totalAmount.toLocaleString()}
                </td>
              </tr>
              {actualPrice > discountedPrice && (
                <tr>
                  <td colSpan={3} className="py-1 text-right text-xs text-gray-500">
                    Original Price:
                  </td>
                  <td className="py-1 text-right text-xs text-gray-500 line-through">
                    ₹{actualPrice.toLocaleString()}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-primary/20" />

        {/* Terms & Conditions */}
        <div className="px-6 py-4 font-[Cambria]">
          <p className="text-lg font-semibold text-primary">
            Terms &amp; Condition :
          </p>
          <ol className="text-gray-700 mt-2 list-decimal pl-6 text-sm">
            <li>
              Amount paid towards purchase of product shall not be refunded at
              any circumstances.
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-primary to-secondary py-3 text-center">
          <p className="font-[Cambria] text-sm text-white opacity-90">
            No signature is required as this is computer generated receipt.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyInvoice;