/* eslint-disable */
import React from 'react';
import {useAuthContext} from '@/context/AuthContext';

interface InvoiceProps {
  createdAt?: string;
}

const MyInvoice: React.FC<InvoiceProps> = ({createdAt}) => {
  const {user} = useAuthContext();
  console.log('user', user);

  const displayDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');
  if (!user) return <p className="py-8 text-center">No user data found</p>;

  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border-4 border-primary/30 bg-white shadow-xl shadow-primary/10">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 text-center text-white">
          <h5 className="font-[Cambria] text-3xl font-bold tracking-widest">
            HAPPILY LIFE
          </h5>
          <p className="mt-1 text-sm opacity-80">
            https://happilylife.online/
          </p>
        </div>

        {/* Receipt Info */}
        <div className="bg- px-6 py-3 text-right font-[Cambria] text-black text-sm">
          <p>Receipt No. : 1001</p>
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
              <li>Member Code : {user.crnNo}</li>
              <li>Member Name : {user.fullname}</li>
              <li>Mobile No : {user.phoneNumber || '-'}</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-primary/20" />

        {/* Terms & Conditions */}
        <div className="px-6 py-4 font-[Cambria]">
          <p className="text-lg font-semibold text-primary">
            Terms &amp; Condition :
          </p>
          <ol className="list-decimal pl-6 text-sm text-gray-700 mt-2">
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
