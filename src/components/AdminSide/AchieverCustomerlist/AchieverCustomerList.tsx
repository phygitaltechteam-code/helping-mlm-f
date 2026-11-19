import React, { useState } from 'react';
import GenericTable, { Column } from '@/components/Forms/Table/GenericTable';
import { useFetchCustomerList } from '@/lib/react-query/Admin/Home/adminHome';
import { useApproveAchievement } from '@/lib/react-query/Customer/commision';

type AchievementCustomerData = {
  id: string;
  fullname: string;
  crnNo: string;
  phoneNumber: string;
  email: string;
  achievements: any[];
  achievement: string;
  achievementDate: string;
  history: string;
  achievementId: string;
  deliverdDate: string;
  status: string;

  // 👇 added for modal
  fullHistory?: any[];
};

const AchieverCustomerList: React.FC = () => {

  const { data, isLoading, error } = useFetchCustomerList();


  // ✅ useMutation hook called at top level (not inside a handler)
  const { mutate: approveAchievementMutate, isPending: isApproving } = useApproveAchievement();
  

  // Modal state
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<AchievementCustomerData | null>(null);

  const [openModal, setOpenModal] = React.useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'cancel' | null>(null);

  // Tracks which customer id the pending confirm action is for
  const [pendingId, setPendingId] = useState<string | null>(null);

  const customerData: AchievementCustomerData[] =
    data
      ?.filter((customer: any) => customer.achivements?.length > 0)
      .map((customer: any) => {
        const sortedAchievements = [...(customer.achivements || [])].sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        const latest = sortedAchievements[0];

        return {
          id: customer.id,
          fullname: customer.fullname,
          crnNo: customer.crnNo,
          phoneNumber: customer.phoneNumber,
          email: customer.email,
          achievements: sortedAchievements,
          achievementId: latest?.id || 'Not Available',
          deliverdDate: latest?.DeliveryDate || null,
          achievement: latest?.name || 'Not Available',
          status: latest.status,
          achievementDate: latest?.createdAt
            ? new Date(latest.createdAt).toLocaleDateString('en-IN')
            : 'Not Available',
          history: 'View History',

          // 👇 store full history for modal
          fullHistory: customer.achivements,
        };
      }) || [];


  console.log("customerData", customerData);

  const handleViewHistory = (item: AchievementCustomerData) => {
    setSelectedCustomer(item);
    setOpenModal(true);
  };

  // Opens the confirmation popup for Approve
  const handleApprove = (achievementId: string) => {
    setPendingId(achievementId);
    setActionType('approve');
    setConfirmModal(true);
  };

  // Opens the confirmation popup for Cancel
  const handleCancel = (achievementId: string) => {
    setPendingId(achievementId);
    setActionType('cancel');
    setConfirmModal(true);
  };

  // Called when user clicks "Yes" in the confirmation popup
  const handleConfirmAction = () => {
    if (actionType === 'approve' && pendingId) {
      const data = approveAchievementMutate(pendingId);
      console.log('data', data);
      setConfirmModal(false);
      setOpenModal(false);
      setPendingId(null);
      setActionType(null);
    } else {
      // Cancel action (wire API here if needed)
      console.log('Cancelled id:', pendingId);
      setConfirmModal(false);
      setOpenModal(false);
      setPendingId(null);
      setActionType(null);
    }
  };

  const columns: Column<AchievementCustomerData>[] = [
    { header: 'Name', accessor: 'fullname' },
    { header: 'Customer ID', accessor: 'crnNo' },
    { header: 'Mobile No', accessor: 'phoneNumber' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Achievement',
      accessor: 'achievement',
      render: (item) => (
        <div className="flex flex-col gap-2">
          {item.achievements.map((ach: any, idx: number) => (
            <div
              key={ach.id}
              className={`py-1 ${
                idx > 0 ? 'border-t border-gray-100' : ''
              } min-h-[45px] flex items-center justify-center text-center`}
            >
              {ach.name || 'Not Available'}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Achievement Date',
      accessor: 'achievementDate',
      render: (item) => (
        <div className="flex flex-col gap-2">
          {item.achievements.map((ach: any, idx: number) => (
            <div
              key={ach.id}
              className={`py-1 ${
                idx > 0 ? 'border-t border-gray-100' : ''
              } min-h-[45px] flex items-center justify-center`}
            >
              {ach.createdAt
                ? new Date(ach.createdAt).toLocaleDateString('en-IN')
                : 'Not Available'}
            </div>
          ))}
        </div>
      ),
    },
    {
      header: 'Action',
      accessor: 'id',
      render: (item) => (
        <div className="flex flex-col gap-2 w-full items-center justify-center">
          {item.achievements.map((ach: any, idx: number) => (
            <div
              key={ach.id}
              className={`py-1 ${
                idx > 0 ? 'border-t border-gray-100' : ''
              } min-h-[45px] flex items-center justify-center w-full`}
            >
              {ach.status === 'DELIVERED' ? (
                <div className="flex flex-col gap-1 items-center justify-center w-full">
                  {/* <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-primary text-white`}
                  >
                    DELIVERED
                  </span> */}
                  {ach.DeliveryDate && ach.DeliveryDate !== '-' && (
                    <span className="text-xs text-gray-500">
                      {new Date(ach.DeliveryDate).toLocaleDateString('en-IN')}
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleApprove(ach.id)}
                  className="rounded-md bg-primary px-2 py-1 text-white outline-none transition hover:bg-primary/80 active:bg-primary/90 text-xs w-full max-w-[100px]"
                >
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load customers</div>;

  return (
    <div>
      <GenericTable
        title="Customer Achievement List"
        data={customerData}
        columns={columns}
        itemsPerPage={15}
        searchAble
      />

      {/* ✅ History Modal */}
      {openModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex max-h-[80vh] w-[600px] flex-col rounded-lg bg-white shadow-lg">

            {/* Modal Header */}
            <div className="border-b px-5 pt-5 pb-4">
              <h2 className="text-lg font-bold">
                Achievement History - {selectedCustomer.fullname}
              </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {selectedCustomer.fullHistory?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Achievement</th>
                        <th className="border p-2 text-left">Status</th>
                        <th className="border p-2 text-left">Delivered Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.fullHistory.map((item: any) => (
                        <tr key={item.id}>
                          <td className="border p-2">{selectedCustomer.fullname}</td>
                          <td className="border p-2">{item.name}</td>
                          <td className="border p-2">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                                item.status === 'DELIVERED'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {item.status || 'PENDING'}
                            </span>
                          </td>
                          <td className="border p-2 text-sm text-gray-600">
                            {item.status === 'DELIVERED' && item.DeliveryDate
                              ? new Date(item.DeliveryDate).toLocaleDateString('en-IN')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No history found</p>
              )}
            </div>

            {/* Sticky Footer - always visible */}
            <div className="border-t px-5 py-4 flex justify-end">
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-gray-600"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-[350px] rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              {actionType === 'approve' ? 'Approve Achievement' : 'Cancel Achievement'}
            </h2>

            <p className="mt-3">
              Are you sure you want to{' '}
              <b>{actionType === 'approve' ? 'approve' : 'cancel'}</b> this achievement?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmModal(false)}
                className="rounded bg-gray-300 px-4 py-2"
                disabled={isApproving}
              >
                No
              </button>

              <button
                className={`rounded px-4 py-2 text-white ${actionType === 'approve' ? 'bg-primary hover:bg-primary/80 active:bg-primary/90' : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-60`}
                onClick={handleConfirmAction}
                disabled={isApproving}
              >
                {isApproving ? 'Processing...' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchieverCustomerList;
