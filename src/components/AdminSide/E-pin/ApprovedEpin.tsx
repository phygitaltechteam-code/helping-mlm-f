import Loader from '@/components/common/Loader';
import GenericTable, { Column } from '@/components/Forms/Table/GenericTable';
import { useGetAdminPins } from '@/lib/react-query/Admin/Epin/epin';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

type EpinData = {
  id: string;
  epinNo: string;
  createdAt: string;
  isUsed: boolean;
  usedAt: string | null;
  usedBy: string | null;
  type: string;
  price: number;

  // optional (if backend supports it)
  status?: string;
};

const EpinColumn: Column<EpinData>[] = [
  { header: 'Created At', accessor: 'createdAt', sortable: true },
  { header: 'E-Pin No', accessor: 'epinNo' },
  {
    header: 'Used',
    accessor: 'isUsed',
    render: (item: EpinData) => (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          item.isUsed
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}
      >
        {item.isUsed ? 'Used' : 'Available'}
      </span>
    ),
    sortable: true,
  },
  { header: 'Used By', accessor: 'usedBy', sortable: true },
  { header: 'Type', accessor: 'type' },
  {
    header: 'Price',
    accessor: 'price',
    render: (item: EpinData) => (
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          item.price === 3150
            ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200'
            : item.price === 3600
            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }`}
      >
        ₹{item.price.toLocaleString('en-IN')}
      </span>
    ),
  },
];

const ApprovedEpin: React.FC = () => {
  const { data: epinData, isLoading, isSuccess } = useGetAdminPins();

  const approvedData = useMemo(() => {
    if (!isSuccess || !Array.isArray(epinData)) return [];

    return epinData
      // ✅ ONLY APPROVED EPINS
      .filter((item: EpinData) => item.status === 'APPROVED')

      .map((epin: EpinData) => ({
        ...epin,
        createdAt: new Date(epin.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        usedAt: epin.usedAt
          ? new Date(epin.usedAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
        usedBy: epin.usedBy || '-',
      }));
  }, [epinData, isSuccess]);

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="rounded-lg p-6 shadow-sm dark:bg-meta-4 dark:text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Approved E-Pins</h2>
      </div>

      <GenericTable
        data={approvedData}
        columns={EpinColumn}
        itemsPerPage={15}
        title=""
        key={'approved-epin'}
        onCopy={(item: EpinData) => {
          navigator.clipboard.writeText(item.epinNo);
          toast.success('E-Pin copied to clipboard!');
        }}
      />
    </div>
  );
};

export default ApprovedEpin;