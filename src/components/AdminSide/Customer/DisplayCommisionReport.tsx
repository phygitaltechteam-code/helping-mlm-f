/* eslint-disable */
import Loader from '@/components/common/Loader';
import GenericTable from '@/components/Forms/Table/GenericTable';
import {useFetchAdminCommsion} from '@/lib/react-query/Admin/Home/commission';
import {Column} from '@/types';
import React, {useEffect, useMemo, useState} from 'react';
import {ChevronDown, ChevronRight, Calendar} from 'lucide-react';

type Commission = {
  id: string;
  createdAt: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  type: string;
  payableAmount: number;
  tdsAmount: number;
  dateOnly?: string;
  crnNo: string;
  fullname: string;
  phoneNumber: string;
  email:string
};

const columns: Column<Commission>[] = [
  {header: 'Date & Time', accessor: 'createdAt'},
  {header: 'CRN No', accessor: 'crnNo'},
  {header: 'Full Name', accessor: 'fullname'},
  {header: 'Contact Number', accessor: 'phoneNumber'},  
  {header: 'Email', accessor: 'email'},
  {header: 'Amount (₹)', accessor: 'amount', sortable: true},
  {header: 'TDS (₹)', accessor: 'tdsAmount', sortable: true},
  {header: 'Payable (₹)', accessor: 'payableAmount', sortable: true},
  {header: 'Type', accessor: 'type'},
  {header: 'Status', accessor: 'status'},
];

const DisplayCommisionReport: React.FC = () => {
  const {
    data: commissionData,
    isSuccess,
    isError,
    isPending,
  } = useFetchAdminCommsion();

  const [data, setData] = useState<Commission[]>([]);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    console.log('commissionData', commissionData);
    if (isSuccess && commissionData) {
      const transformed: Commission[] = commissionData
      .filter((item: any) => item.amount > 0 && item.status === 'PAID')
        .map((item: any) => {
          const date = new Date(item.createdAt);

          const formattedDateTime = new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }).format(date);

          const dateOnly = new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }).format(date);

          return {
            id: item.id,
            createdAt: formattedDateTime,
            dateOnly: dateOnly,
            amount: item.amount,
            status: item.status,
            type: item.type,
            payableAmount: item.payableAmount,
            tdsAmount: item.tdsAmount,
            crnNo: item.crnNo || item.customer?.crnNo || 'N/A',
            fullname: item.fullname || item.customer?.user?.fullname || 'N/A',
            phoneNumber: item.phoneNumber || item.customer?.user?.phoneNumber || 'N/A',
            email: item.email || item.customer?.user?.email || 'N/A',
          };
        })
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
        );

      setData(transformed);

      const dates = new Set(transformed.map((item: any) => item.dateOnly));
      setExpandedDates(dates);
    }
  }, [isSuccess, commissionData]);

  // Group data by date
  const groupedData = useMemo(() => {
    const groups: {[key: string]: Commission[]} = {};

    data.forEach((item: any) => {
      const date = item.dateOnly;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });

    return groups;
  }, [data]);

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  if (isPending) return <Loader />;
  if (isError) return <div>Error loading commission data</div>;

 return (
    <div className="p-2">
      <div className="mb-6">
        <h1 className="text-gray-800 text-2xl font-bold">
          Commission Report
        </h1>
      </div>
      
      {/* 1. Added curly braces around the whole logic block */}
      {/* 2. Changed condition to check the length of your filtered data array */}
      {data.length === 0 ? (
        <GenericTable
          data={[]}
          columns={columns}
          itemsPerPage={5}
          searchAble={false}
          title="No commission data available"
        />
      ) : ( 
        <div className="space-y-4">
          {Object.entries(groupedData).map(([date, items]) => (
            <div
              key={date}
              className="overflow-hidden rounded-lg border border-stroke bg-white shadow"
            >
              {/* Header */}
              <div
                onClick={() => toggleDate(date)}
                className="bg-gray-50 hover:bg-gray-100 flex cursor-pointer items-center gap-2 px-4 py-3"
              >
                {expandedDates.has(date) ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
                <Calendar size={18} />
                <h2 className="text-lg font-semibold">{date}</h2>
              </div>

              {/* Table */}
              {expandedDates.has(date) && (
                <div className="border-t border-stroke">
                  <GenericTable
                    data={items}
                    columns={columns}
                    itemsPerPage={items.length}
                    searchAble={false}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )} {/* <-- Make sure to close the curly brace here */}
    </div>
  );
};

export default DisplayCommisionReport;