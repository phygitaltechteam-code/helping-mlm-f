/* eslint-disable */

// ⚠️ IMPORTANT:
// This component handles PENDING E-Pin approval/rejection.
// File name is "ApprovedEpin.tsx" only for route compatibility.
// Do NOT assume this shows approved data.

import Loader from '@/components/common/Loader';
import GenericTable, { Column } from '@/components/Forms/Table/GenericTable';
import { useGetAdminPins } from '@/lib/react-query/Admin/Epin/epin';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

// 👉 When backend is ready, import these:
// import { useApproveEpin, useRejectEpin } from '@/lib/react-query/Admin/Epin/epin';

type EpinData = {
  id: string;
  epinNo: string;
  createdAt: string;
  isUsed: boolean;
  usedAt: string | null;
  usedBy: string | null;
  type: string;
  price: number;
  status?: string;
};

const ApprovedEpin: React.FC = () => {
  const { data: epinData, isLoading, isSuccess } = useGetAdminPins();

  // 👉 Connect these when API is available
  // const { mutate: approveEpin } = useApproveEpin();
  // const { mutate: rejectEpin } = useRejectEpin();

  const handleApprove = (id: string) => {
    // approveEpin(id, { onSuccess: () => toast.success('Approved successfully') });
    toast.success(`Approved E-Pin ${id}`);
  };

  const handleReject = (id: string) => {
    // rejectEpin(id, { onSuccess: () => toast.error('Rejected successfully') });
    toast.error(`Rejected E-Pin ${id}`);
  };

  const columns: Column<EpinData>[] = [
    { header: 'Created At', accessor: 'createdAt', sortable: true },

    { header: 'E-Pin No', accessor: 'epinNo' },

    {
      header: 'Status',
      accessor: 'status',
      render: (item: EpinData) => (
        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
          {item.status || 'PENDING'}
        </span>
      ),
    },

    {
      header: 'Used',
      accessor: 'isUsed',
      render: (item: EpinData) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            item.isUsed
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
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
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
          ₹{item.price.toLocaleString('en-IN')}
        </span>
      ),
    },

    // 🔥 ACTION COLUMN
    {
      header: 'Action',
      accessor: 'action',
      render: (item: EpinData) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleApprove(item.id)}
            className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
          >
            Approve
          </button>

          <button
            onClick={() => handleReject(item.id)}
            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const pendingData = useMemo(() => {
    if (!isSuccess || !Array.isArray(epinData)) return [];

    return epinData
      // ✅ SHOW ONLY PENDING REQUESTS
      .filter((item: EpinData) => item.status === 'PENDING')

      .map((epin: EpinData) => ({
        ...epin,
        createdAt: new Date(epin.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
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
        <h2 className="text-2xl font-semibold">
          Pending E-Pin Requests
        </h2>
      </div>

      <GenericTable
        data={pendingData}
        columns={columns}
        itemsPerPage={15}
        key={'pending-epin'}
        onCopy={(item: EpinData) => {
          navigator.clipboard.writeText(item.epinNo);
          toast.success('E-Pin copied to clipboard!');
        }}
      />
    </div>
  );
};

export default ApprovedEpin;