import React from 'react';
import GenericTable from '@/components/Forms/Table/GenericTable';
import {Column} from '@/types';
import {useFetchCustomerList} from '@/lib/react-query/Admin/Home/adminHome';

type AchievementCustomerData = {
  id: string;
  fullname: string;
  crnNo: string;
  phoneNumber: string;
  email: string;
  achievement: string;
  achievementDate: string;
  history: string;

  // 👇 added for modal
  fullHistory?: any[];
};

const columns: Column<AchievementCustomerData>[] = [
  {header: 'Name', accessor: 'fullname'},
  {header: 'Customer ID', accessor: 'crnNo'},
  {header: 'Mobile No', accessor: 'phoneNumber'},
  {header: 'Email', accessor: 'email'},
  {header: 'Achievement', accessor: 'achievement'},
  {header: 'Achievement Date', accessor: 'achievementDate'},
  //   { header: 'History', accessor: 'history' },
];

const AchieverCustomerList: React.FC = () => {
  const {data, isLoading, error} = useFetchCustomerList();

  // 👇 modal state
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<AchievementCustomerData | null>(null);
  const [openModal, setOpenModal] = React.useState(false);

  const customerData: AchievementCustomerData[] =
    data
      ?.filter((customer: any) => customer.achivements?.length > 0)
      .map((customer: any) => {
        const latest = customer.achivements?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

        return {
          id: customer.id,
          fullname: customer.fullname,
          crnNo: customer.crnNo,
          phoneNumber: customer.phoneNumber,
          email: customer.email,

          achievement: latest?.name || 'Not Available',
          achievementDate: latest?.createdAt
            ? new Date(latest.createdAt).toLocaleDateString('en-IN')
            : 'Not Available',
          history: 'View History',

          // 👇 store full history for modal
          fullHistory: customer.achivements,
        };
      }) || [];

  const handleViewHistory = (item: AchievementCustomerData) => {
    setSelectedCustomer(item);
    setOpenModal(true);
  };

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
        onView={handleViewHistory}
      />

      {/* ✅ MODAL */}
      {openModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[80vh] w-[600px] overflow-auto rounded bg-white p-5">
            <h2 className="mb-4 text-lg font-bold">
              Achievement History - {selectedCustomer.fullname}
            </h2>

            {selectedCustomer.fullHistory?.length ? (
              <div className="overflow-x-auto">
                <table className="border-gray-300 w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Name</th>
                      <th className="border p-2 text-left">Achievement</th>
                      {/* <th className="border p-2 text-left">Date</th>
                                            <th className="border p-2 text-left">Description</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCustomer.fullHistory.map((item: any) => (
                      <tr key={item.id}>
                        <td className="border p-2">
                          {selectedCustomer.fullname}
                        </td>
                        <td className="border p-2">{item.name}</td>
                        {/* <td className="border p-2">
                                                    {new Date(item.createdAt).toLocaleString('en-US', {
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </td>
                                                <td className="border p-2">
                                                    {item.description}
                                                </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No history found</p>
            )}

            <button
              className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => setOpenModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchieverCustomerList;
