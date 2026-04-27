/* eslint-disable */

import Loader from '@/components/common/Loader';
import GenericTable from '@/components/Forms/Table/GenericTable';
import {useAuthContext} from '@/context/AuthContext';
import {useGetCommission} from '@/lib/react-query/Customer/commision';
import {Column} from '@/types';
import React, {useEffect, useState} from 'react';

type Data = {
  id: string;
  dateTime: string;
  amount: number;
  payableAmount: number;
  tdsAmount: number;
  status: string;
  type: string;
  details: string;
  walletAddress: string;
};

const CommissionReport: React.FC = () => {
  const {user} = useAuthContext();
  const id = user?.id;

  const {data: apiData, isLoading, error} = useGetCommission();
  console.log('apiData', apiData);

  const [commissionData, setCommissionData] = useState<Data[]>([]);

  const commissionColumns: Column<Data>[] = [
    {
      header: 'Date Time',
      accessor: 'dateTime',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      Cell: (value: number) => <span>${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: 'Admin Charges',
      accessor: 'tdsAmount',
      Cell: (value: number) => <span>${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: 'Payable Amount',
      accessor: 'payableAmount',
      Cell: (value: number) => <span>${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: 'Type',
      accessor: 'details',
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            value === 'PAID'
              ? 'bg-green-100 text-green-800'
              : value === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (apiData && Array.isArray(apiData)) {
      // Map the API response to the required data structure
      const mappedData = apiData
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((item: any) => ({
          id: item.id?.substring(0, 8) || 'N/A', // Show first 8 chars of ID
          dateTime: new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(new Date(item.createdAt)),
          amount: `$` + `` + item.amount || 0,
          payableAmount: `$` + `` + (item.payableAmount || 0),
          tdsAmount: `$` + `` + (item.tdsAmount || 0),
          status: item.status || 'N/A',
          type: item.type || 'N/A',
          details: item.details || 'N/A',
          walletAddress: item.customer?.wallet?.walletAddress || 'N/A',
        }));
      setCommissionData(mappedData);
    }
  }, [apiData]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-600">
        Error fetching commission data. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 mt-4 text-xl font-bold">Commission Report </h1>
      {commissionData.length === 0 ? (
        <p className="text-gray-500">No commission data available.</p>
      ) : (
        <GenericTable columns={commissionColumns} data={commissionData} />
      )}
    </div>
  );
};

export default CommissionReport;
