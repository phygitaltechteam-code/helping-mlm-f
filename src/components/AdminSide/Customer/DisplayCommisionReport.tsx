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
};

const columns: Column<Commission>[] = [
  {header: 'Date & Time', accessor: 'createdAt'},
  {header: 'Amount ($)', accessor: 'amount', sortable: true},
  {header: 'TDS ($)', accessor: 'tdsAmount', sortable: true},
  {header: 'Payable ($)', accessor: 'payableAmount', sortable: true},
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
    </div>
  );
};

export default DisplayCommisionReport;