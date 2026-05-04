import React from 'react';
import GenericTable, { Column } from '@/components/Forms/Table/GenericTable';
import { useGetCustomerEpins } from '@/lib/react-query/Admin/Epin/epin';
import toast from 'react-hot-toast';
import EpinForm from './EpinForm';

// type CustomerEpinData = {
//   id: string;
//   epinNo: string;
//   assignedToId: string;
//   createdAt: string;
//   isUsed: boolean;
//   usedAt: string | null;
//   requestId: string;
//   usedBy: string | null;
//   customer: {
//     firstName: string;
//     lastName: string;
//     crnNo: string;
//   };
// };

type CustomerEpinData = {
  id: string;
  epinNo: string;
  assignedToId: string;
  createdAt: string;
  isUsed: boolean;
  usedAt: string | null;
  requestId: string;
  usedBy: string | null;
  customer: {
    crnNo: string;
    user?: {
      fullname: string;
      phoneNumber?: string;
    };
  };
};

const CustomerEpinColumn: Column<CustomerEpinData>[] = [
  { header: 'Date', accessor: 'createdAt' },
  { header: 'E-Pin No', accessor: 'epinNo' },
  // { header: 'Used', accessor: 'isUsed', sortable: true },
  {
  header: 'Status',
  accessor: (row) => (row.isUsed ? 'Used' : 'Not Used'),
  sortable: true,
},
  // { header: 'Used By', accessor: 'usedBy' },
{
  header: 'Used By (CRN)',
  accessor: (row) =>
    row.isUsed ? row.customer?.crnNo || '-' : 'Not Used',
},
 {
    header: 'Customer Name',
    accessor: (row) => row.customer?.user?.fullname || '-',
  },

  { header: 'Customer ID', accessor: (row) => row.customer?.crnNo || '' },
];

const CustomerEpins: React.FC = () => {
  console.log("TABLE RENDERED");
  const {
    data: CustomerepinData,
    isSuccess: customerEpinSuccess,
    isLoading,
  } = useGetCustomerEpins();
  console.log('customer Eping data : ', CustomerepinData);

  const CustomerFormattedData = customerEpinSuccess
    ? (Array.isArray(CustomerepinData) ? CustomerepinData : (CustomerepinData as any)?.data || [])
    .map((epin: CustomerEpinData) => ({
      ...epin,
      isUsed: epin.isUsed,
      createdAt: new Date(epin.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      usedAt: epin.usedAt
        ? new Date(epin.usedAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        : 'null',
    }))
    : [];
  return (
    <>
      <div>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <GenericTable
            data={CustomerFormattedData || []}
            columns={CustomerEpinColumn}
            itemsPerPage={15}
            searchAble
            title="Customers E-Pin"
            key="epin"
            onCopy={(item: CustomerEpinData) => {
              navigator.clipboard.writeText(item.epinNo);
              toast.success('Copied to clipboard');
            }}
          />
        )}
      </div>
    </>
  );
};

export default CustomerEpins;
