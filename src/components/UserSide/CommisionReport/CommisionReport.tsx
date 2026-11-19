import GenericTable, { Column } from '@/components/Forms/Table/GenericTable';
import { useAuthContext } from '@/context/AuthContext';
import { useGetCommission } from '@/lib/react-query/Customer/commision';
import { Loader } from 'lucide-react';
import { useMemo, useState } from 'react';

/* eslint-disable */

const CommissionReport: React.FC = () => {
  const { user } = useAuthContext();
  const id = user?.id;
  const [filterType, setFilterType] = useState('');

  // Available filter options – match exactly the enum values (uppercase)
  const types = [
    { value: 'GENERATION', label: 'GENERATION' },
    { value: 'BONUS', label: 'BONUS' },
    { value: 'POOL', label: 'POOL' },
    { value: 'HELPING', label: 'AUTO' },   // API returns 'HELPING' for 'AUTO'
  ];

  const { data: apiData, isLoading, error } = useGetCommission(id?.toString() || '');

  // Compute filtered data reactively – no useEffect needed
  const filteredData = useMemo(() => {
    // 1. Safely extract the actual array from the API response
    let rawData: any[] = [];
    if (Array.isArray(apiData)) {
      rawData = apiData;
    } else if (apiData && typeof apiData === 'object' && Array.isArray(apiData.data)) {
      rawData = apiData.data; // adjust property name if your API wraps data
    } else {
      return [];
    }

    // 2. Filter, sort, and map
    return rawData
      .slice() // avoid mutating original
      .filter((item) => {
        if (!filterType) return true;
        // Case‑insensitive comparison to avoid mismatches
        return item.type?.toUpperCase() === filterType.toUpperCase();
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((item: any) => {
        const amount = Number(item.amount || 0);
        const tdsAmount = (amount * 0.03).toFixed(2);
        const adminCharges = (amount * 0.07).toFixed(2);
        const payableAmount = amount - (Number(tdsAmount) + Number(adminCharges));

        return {
          id: item.id?.substring(0, 8) || 'N/A',
          dateTime: new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(new Date(item.createdAt)),
          amount,
          payableAmount,
          tdsAmount,
          adminCharges,
          status: item.status || 'N/A',
          type: item.type || 'N/A',
          details: item.details || 'N/A',
          walletAddress: item.customer?.wallet?.walletAddress || 'N/A',
        };
      });
  }, [apiData, filterType]);

  // Define table columns
  const commissionColumns: Column<any>[] = [
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
      header: '3% TDS',
      accessor: 'tdsAmount',
      Cell: (value: number) => <span>${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: '7% Admin Charges',
      accessor: 'adminCharges',
      Cell: (value: number) => <span>${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: 'Total Receivable',
      accessor: 'payableAmount',
      Cell: (value: number) => <span>${value?.toFixed(2) || '0.00'}</span>,
    },
    {
      header: 'Details',
      accessor: 'details',
      Cell: (value: string) => value || 'N/A',
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

  // Loading / error states
  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="rounded-md bg-red-50 p-4 text-red-600">
        Error fetching commission data. Please try again later.
      </div>
    );

  // Handler for the native select
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="p-1">
      <h1 className="mb-4 mt-4 text-xl font-bold">Commission Report</h1>

      {/* Filter dropdown – native select, no external dependency */}
      <div className="mb-4 max-w-xs">
        <label htmlFor="type-filter" className="sr-only">
          Filter by Type
        </label>
        <select
          id="type-filter"
          value={filterType}
          onChange={handleTypeChange}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <GenericTable columns={commissionColumns} data={filteredData} />
    </div>
  );
};

export default CommissionReport;