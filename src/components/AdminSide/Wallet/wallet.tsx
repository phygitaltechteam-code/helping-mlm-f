import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericTable from '@/components/Forms/Table/GenericTable';
import {useGetCustomerLevel} from '@/lib/react-query/Customer/home';
import {useNavigate} from '@tanstack/react-router';
import React, {useMemo} from 'react';
import {BsWalletFill} from 'react-icons/bs';

const Wallet = () => {
  const navigate = useNavigate();
  const {data, isPending} = useGetCustomerLevel();

  const walletAmount = data?.amount ?? 0;

  const formattedWalletHistory = useMemo(() => {
    if (!data?.walletHistory) return [];

    return [...data.walletHistory]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
      }));
  }, [data]);

  const columns = [
    {header: 'Date', accessor: 'createdAt'},
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => `${row.amount} $`,
    },
    // {header: 'Amount Type', accessor: 'amountType'},
    {header: 'History Type', accessor: 'historyType'},
    {header: 'Details', accessor: 'details'},
    // {header: 'Status', accessor: 'status'},
  ];

  if (isPending) return <div>Loading...</div>;

  return (
    <>
      {/* Wallet History */}
      <div>
        <h1 className="mb-2 text-xl font-bold">Wallet History</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Non Withdrawable Amount: {data?.nonWithdrawableAmount ?? 0} $
        </p>

        <GenericTable columns={columns} data={formattedWalletHistory} />
      </div>
    </>
  );
};

export default Wallet;
