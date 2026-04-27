import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_app/customer/_wallet/fundrequestHistory',
)({
  component: WithdrawalHistory,
})

import GenericTable from '@/components/Forms/Table/GenericTable';
import { useGetEpinRequests } from '@/lib/react-query/Customer/epin';
import React, { useMemo, useState } from 'react';

function WithdrawalHistory() {
  const { data, isPending } = useGetEpinRequests();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formattedData = useMemo(() => {
    if (!data) return [];

    return [...data]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .map((item) => ({
        ...item,
        amount: `${item.amount} $`,
        createdAt: new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date(item.createdAt)),
        status: item.isApproved
          ? 'Approved'
          : item.isPending
          ? 'Pending'
          : 'Rejected',
      }));
  }, [data]);

  const columns = [
    { header: 'Date', accessor: 'createdAt' },
    { header: 'Requested By', accessor: 'requestedBy' },

    {
      header: 'Amount',
      accessor: 'paidAmount',
      cell: (row) => `${row.paidAmount} $`,
    },

    {
      header: 'Proof',
      accessor: 'image',
      cell: (row) => (
        <img
          src={row.image}
          alt="proof"
          onClick={() => setSelectedImage(row.image)}
          className="w-12 h-12 object-cover rounded cursor-pointer hover:scale-105 transition"
        />
      ),
    },

    { header: 'Price', accessor: 'price' },

    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs rounded font-medium ${
            row.status === 'Approved'
              ? 'bg-green-100 text-green-600'
              : row.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  if (isPending) return <div>Loading...</div>;

  return (
    <>
      <div>
        <h1 className="mb-2 text-xl font-bold">Activation History</h1>

        {formattedData.length > 0 ? (
          <GenericTable columns={columns} data={formattedData} />
        ) : (
          <p className="py-4 text-center text-gray-500">
            No Activation history found
          </p>
        )}
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default WithdrawalHistory;