/*eslint-disable*/
import React, {useState, useMemo, useEffect} from 'react';
import {
  useFetchAdminCommsion,
  usePayCommission,
  usePayCommissionAll,
} from '@/lib/react-query/Admin/Home/commission';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import Loader from '@/components/common/Loader';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {ChevronDown, ChevronRight, Calendar} from 'lucide-react';
import {api} from '@/utils/axios';
import {ApiError} from '@/types';
import GenericTable from '@/components/Forms/Table/GenericTable';

type PendingCommission = {
  id: string;
  customerId: string;
  createdAt: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  details: string;
  type: string;
  payableAmount: number;
  adminAmount: number;
  tdsAmount: number;
  crnNo: string;
  phoneNumber: string;
  fullname: string;
  email: string;
  dateOnly?: string;
  weekRange?: string;
  formattedTime?: string;
  bankName?: string;
  bankAccNo?: string;
  bankIFSC?: string;
  bankBranch?: string;
  ids?: string[];
};

export const payCommissionBulkAll = async (ids: string[]) => {
  try {
    const response = await api.put(`/admin/commission`, ids);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error(
      'Error in payCommissionBulkAll:',
      err.response?.data.message || err.message,
    );
    throw err.response?.data || err;
  }
};

export const usePayBulkCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => payCommissionBulkAll(ids),
    onSuccess: () => {},
    onError: (error) => {
      console.error('Failed to pay commission:', error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-commission'],
      });
    },
  });
};

// Helper function to get week range from a date
const getWeekRange = (date: Date): string => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diffToMonday = day === 0 ? 6 : day - 1; // Adjust to Monday as start of week
  
  startOfWeek.setDate(date.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  };
  
  return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
};

// Helper function to get week number and year for sorting
const getWeekKey = (date: Date): string => {
  const weekRange = getWeekRange(date);
  const year = date.getFullYear();
  const weekNumber = getWeekNumber(date);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
};

const getWeekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

const DisplayPendingCommisionReport: React.FC = () => {
  const queryClient = useQueryClient();

  const {data, isSuccess, isError, isPending} = useFetchAdminCommsion();
  console.log('data', data);
  const {mutate: payCommission} = usePayCommission();
  const {mutate: payAllCommission} = usePayCommissionAll();
  const {mutate: payBulkCommission} = usePayBulkCommission();

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeekForPayAll, setSelectedWeekForPayAll] = useState<string | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  const [bulkPaymentIds, setBulkPaymentIds] = useState<string[]>([]);

  const filterData = (data: any[], filter: string | null) => {
    if (!data) return [];

    const filteredData = data.filter(
      (item) =>
        item.details?.toLowerCase() !== 'fleshout' &&
        item.status === 'PENDING' &&
        item.amount > 0,
    );

    if (!filter || filter === 'All') return filteredData;

    return filteredData;
  };

  // Transform and group data by week
  const processedData = useMemo(() => {
    if (!data) return [];

    const filtered = filterData(data, selectedFilter);

    return filtered
      .map((item: any) => {
        const date = new Date(item.createdAt);
        const weekRange = getWeekRange(date);
        const weekKey = getWeekKey(date);

        const formattedTime = new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(date);

        const fullDate = new Intl.DateTimeFormat('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(date);

        return {
          id: item.id,
          customerId: item.customerId,
          createdAt: item.createdAt,
          weekRange: weekRange,
          weekKey: weekKey,
          fullDate: fullDate,
          formattedTime: formattedTime,
          amount: item.amount,
          status: item.status,
          details: item.details,
          type: item.type,
          payableAmount: item.payableAmount,
          adminAmount: parseFloat((item.amount * 0.07).toFixed(2)),
          tdsAmount: parseFloat((item.amount * 0.03).toFixed(2)),
          crnNo: item.crnNo || 'N/A',
          phoneNumber: item.phoneNumber || item.customer?.user?.phoneNumber || '-',
          fullname: item.fullname || item.customer?.user?.fullname || '-',
          email: item.email || item.customer?.user?.email || '-',
          bankName: item.bankName || item.customer?.bankName || '-',
          bankAccNo: item.bankAccNo || item.customer?.bankAccNo || '-',
          bankIFSC: item.bankIFSC || item.customer?.bankIFSC || '-',
          bankBranch: item.bankBranch || item.customer?.bankBranch || '-',
        };
      })
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [data, selectedFilter]);

  // Group data by week and aggregate by customer
  const groupedData = useMemo(() => {
    const groups: {[key: string]: any[]} = {};

    processedData.forEach((item: any) => {
      const weekKey = item.weekKey;
      if (!groups[weekKey]) {
        groups[weekKey] = [];
      }
      groups[weekKey].push(item);
    });

    // Sort weeks in descending order (most recent first)
    const sortedGroups: {[key: string]: any[]} = {};
    Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .forEach((key) => {
        // Within each week, aggregate items by customerId (or crnNo if customerId is missing)
        const customerGroups: {[custId: string]: any} = {};

        groups[key].forEach((item: any) => {
          const custId = item.crnNo ;
          if (!customerGroups[custId]) {
            customerGroups[custId] = {
              ...item,
              ids: [item.id],
              detailsList: item.details ? [item.details] : [],
              typeList: item.type ? [item.type] : [],
            };
          } else {
            const existing = customerGroups[custId];
            existing.ids.push(item.id);
            existing.amount += item.amount;
            existing.payableAmount += item.payableAmount;
            existing.adminAmount += item.adminAmount;
            existing.tdsAmount += item.tdsAmount;

            if (item.details && !existing.detailsList.includes(item.details)) {
              existing.detailsList.push(item.details);
            }
            if (item.type && !existing.typeList.includes(item.type)) {
              existing.typeList.push(item.type);
            }

            // Keep the latest date/time
            if (new Date(item.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
              existing.createdAt = item.createdAt;
              existing.fullDate = item.fullDate;
              existing.formattedTime = item.formattedTime;
            }
          }
        });

        // Map aggregated groups back to list, processing details and type to strings
        sortedGroups[key] = Object.values(customerGroups).map((aggregated: any) => {
          return {
            ...aggregated,
            amount: parseFloat(aggregated.amount.toFixed(2)),
            payableAmount: parseFloat(aggregated.payableAmount.toFixed(2)),
            adminAmount: parseFloat(aggregated.adminAmount.toFixed(2)),
            tdsAmount: parseFloat(aggregated.tdsAmount.toFixed(2)),
            details: aggregated.detailsList.join(', '),
            type: aggregated.typeList.join(', '),
          };
        });
      });

    return sortedGroups;
  }, [processedData]);

  // Get week display name for each group
  const weekDisplayNames = useMemo(() => {
    const names: {[key: string]: string} = {};
    Object.entries(groupedData).forEach(([weekKey, items]) => {
      if (items.length > 0) {
        names[weekKey] = items[0].weekRange;
      }
    });
    return names;
  }, [groupedData]);

  // Calculate summaries for each week
  const weekSummaries = useMemo(() => {
    const summaries: {
      [key: string]: {
        totalAmount: number;
        totalPayable: number;
        totalTDS: number;
        totalAdmin: number;
        count: number;
      };
    } = {};

    Object.entries(groupedData).forEach(([weekKey, items]) => {
      summaries[weekKey] = {
        totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
        totalPayable: items.reduce((sum, item) => sum + item.payableAmount, 0),
        totalTDS: items.reduce((sum, item) => sum + item.tdsAmount, 0),
        totalAdmin: items.reduce((sum, item) => sum + item.adminAmount, 0),
        count: items.length,
      };
    });

    return summaries;
  }, [groupedData]);

  useEffect(() => {
    if (Object.keys(groupedData).length > 0) {
      setExpandedWeeks(new Set(Object.keys(groupedData)));
    }
  }, [groupedData]);

  const handlePayClick = (row: PendingCommission) => {
    const ids = row.ids || [row.id];
    if (ids.length === 1) {
      payCommission(
        {id: ids[0], data: {status: 'PAID'}},
        {
          onSuccess: () => {
            toast.success('Commission paid successfully');
            queryClient.invalidateQueries({queryKey: ['admin-commission']});
          },
          onError: (error) => {
            toast.error('Failed to pay commission');
            console.error('Pay error:', error);
          },
        },
      );
    } else {
      const loadingToast = toast.loading(`Paying ${ids.length} commissions...`);
      payBulkCommission(ids, {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Commissions paid successfully');
          queryClient.invalidateQueries({queryKey: ['admin-commission']});
        },
        onError: (error) => {
          toast.dismiss(loadingToast);
          toast.error('Failed to pay commissions');
          console.error('Pay error:', error);
        },
      });
    }
  };

  const handlePayAllForWeek = (weekKey: string) => {
    const weekItems = groupedData[weekKey] || [];
    const ids = weekItems.flatMap((item) => item.ids || [item.id]);

    setBulkPaymentIds(ids);
    setSelectedWeekForPayAll(weekKey);
    setIsModalOpen(true);
  };

  const handlePayAllClick = () => {
    setBulkPaymentIds([]);
    setSelectedWeekForPayAll(null);
    setIsModalOpen(true);
  };

  const confirmPayAll = () => {
    setIsProcessingBulk(true);

    if (selectedWeekForPayAll) {
      const ids = bulkPaymentIds;

      if (ids.length === 0) {
        toast.error('No commissions found for this week');
        setIsProcessingBulk(false);
        setIsModalOpen(false);
        return;
      }

      const weekDisplay = weekDisplayNames[selectedWeekForPayAll];
      const loadingToast = toast.loading(
        `Paying ${ids.length} commissions for week of ${weekDisplay}...`,
      );

      payBulkCommission(ids, {
        onSuccess: (data) => {
          toast.dismiss(loadingToast);
          toast.success(
            `Successfully paid ${ids.length} commissions for week of ${weekDisplay}`,
          );
          queryClient.invalidateQueries({queryKey: ['admin-commission']});
          setIsProcessingBulk(false);
          setIsModalOpen(false);
          setSelectedWeekForPayAll(null);
          setBulkPaymentIds([]);
        },
        onError: (error) => {
          toast.dismiss(loadingToast);
          toast.error('Failed to pay commissions');
          console.error('Bulk payment error:', error);
          setIsProcessingBulk(false);
          setIsModalOpen(false);
          setSelectedWeekForPayAll(null);
          setBulkPaymentIds([]);
        },
      });
    } else {
      const loadingToast = toast.loading('Paying all commissions...');

      payAllCommission(undefined, {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('All commissions paid successfully');
          queryClient.invalidateQueries({queryKey: ['admin-commission']});
          setIsProcessingBulk(false);
          setIsModalOpen(false);
        },
        onError: (error) => {
          toast.dismiss(loadingToast);
          toast.error('Failed to pay all commissions');
          console.error('Pay all error:', error);
          setIsProcessingBulk(false);
          setIsModalOpen(false);
        },
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWeekForPayAll(null);
    setBulkPaymentIds([]);
  };

  const handleExportToExcel = () => {
    const exportData = Object.entries(groupedData).flatMap(([weekKey, items]) =>
      items.map((item) => ({
        'Week': weekDisplayNames[weekKey],
        'Date': item.fullDate,
        'Time': item.formattedTime,
        'CRN No': item.crnNo,
        'Full Name': item.fullname,
        Phone: item.phoneNumber,
        Email: item.email,
        'Bank Name': item.bankName,
        'Account No': item.bankAccNo,
        'IFSC Code': item.bankIFSC,
        Branch: item.bankBranch,
        Amount: item.amount,
        Payable: item.payableAmount,
        TDS: item.tdsAmount,
        Details: item.details,
        Type: item.type,
        Status: item.status,
      })),
    );

    if (exportData.length > 0) {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `${selectedFilter || 'All'} Pending Commissions`,
      );
      XLSX.writeFile(wb, `${selectedFilter || 'all'}_pending_commissions.xlsx`);
      toast.success(`Exported ${exportData.length} records to Excel`);
    } else {
      toast.error('No data to export');
    }
  };

  const toggleWeek = (weekKey: string) => {
    setExpandedWeeks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(weekKey)) {
        newSet.delete(weekKey);
      } else {
        newSet.add(weekKey);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedWeeks(new Set(Object.keys(groupedData)));
  };

  const collapseAll = () => {
    setExpandedWeeks(new Set());
  };

  const totalRecords = useMemo(() => {
    return Object.values(groupedData).reduce((sum, items) => sum + items.length, 0);
  }, [groupedData]);
  const totalWeeks = Object.keys(groupedData).length;

  if (isPending) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-8 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          Error loading commission data
        </h3>
        <p className="text-gray-500 mt-2">
          Please try again later or contact support
        </p>
      </div>
    );
  }

  if (!isSuccess || !data) {
    return (
      <div className="rounded-sm border border-stroke bg-white p-8 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-medium text-black dark:text-white">
          No commission data available
        </h3>
        <p className="text-gray-500 mt-2">
          Unable to fetch commission data at this time
        </p>
      </div>
    );
  }

  return (
    <div className="flex auto-rows-max flex-col p-2">
      {/* Header with Filters and Export */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-800 text-2xl font-bold">
            {selectedFilter
              ? `${selectedFilter} Pending Commissions`
              : 'Pending Commissions'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Grouped by week | {totalWeeks} week(s) | {totalRecords} record(s)
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Expand/Collapse All Buttons */}
          {totalWeeks > 0 && (
            <>
              <button
                onClick={expandAll}
                className="rounded border border-stroke px-3 py-1 text-sm transition-colors hover:bg-gray-50"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="rounded border border-stroke px-3 py-1 text-sm transition-colors hover:bg-gray-50"
              >
                Collapse All
              </button>
            </>
          )}

          {/* Pay All Button */}
          {totalRecords > 0 && (
            <button
              onClick={handlePayAllClick}
              className="rounded bg-secondary px-4 py-2 text-sm text-white transition-colors hover:bg-secondary"
            >
              Pay All ({totalRecords})
            </button>
          )}

          {/* Export Button */}
          {totalRecords > 0 && (
            <button
              onClick={handleExportToExcel}
              className="rounded bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-secondary"
            >
              Export to Excel
            </button>
          )}
        </div>
      </div>

      {totalRecords === 0 ? (
        <div className="rounded-sm border border-stroke bg-white p-8 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
          <GenericTable
            columns={[
              {header: 'Week', accessor: 'weekRange'},
              {header: 'Date', accessor: 'fullDate'},
              {header: 'Time', accessor: 'formattedTime'},
              {header: 'CRN No', accessor: 'crnNo'},
              {header: 'Full Name', accessor: 'fullname'},
              {header: 'Phone', accessor: 'phoneNumber'},
              {header: 'Email', accessor: 'email'},
              {header: 'Bank Name', accessor: 'bankName'},
              {header: 'Account No', accessor: 'bankAccNo'},
              {header: 'IFSC Code', accessor: 'bankIFSC'},
              {header: 'Branch', accessor: 'bankBranch'},
              {header: 'Amount', accessor: 'amount'},
              {header: 'Payable', accessor: 'payableAmount'},
              {header: 'TDS', accessor: 'tdsAmount'},
              {header: 'Details', accessor: 'details'},
              {header: 'Type', accessor: 'type'},
              {header: 'Status', accessor: 'status'},
            ]}
            data={[]}
            itemsPerPage={5}
            searchAble={false}
            title="No commission data available"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedData).map(([weekKey, items]) => (
            <div
              key={weekKey}
              className="overflow-hidden rounded-lg border border-stroke bg-white shadow"
            >
              {/* Week Header */}
              <div
                onClick={() => toggleWeek(weekKey)}
                className="bg-gray-50 hover:bg-gray-100 flex cursor-pointer auto-rows-max items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  {expandedWeeks.has(weekKey) ? (
                    <ChevronDown size={20} className="text-gray-600" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-600" />
                  )}
                  <Calendar size={18} className="text-gray-500" />
                  <h2 className="text-gray-700 text-lg font-semibold">
                    Week of {weekDisplayNames[weekKey]}
                  </h2>
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {items.length} record(s)
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  {/* Week Summary */}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600 font-medium">
                      Amount:{' '}
                      <span className="font-semibold text-gray-900">
                        ₹{weekSummaries[weekKey]?.totalAmount.toFixed(2)}
                      </span>
                    </span>
                    <span className="font-medium text-primary">
                      Payable:{' '}
                      <span className="font-semibold">
                        ₹{weekSummaries[weekKey]?.totalPayable.toFixed(2)}
                      </span>
                    </span>
                    <span className="font-medium text-orange-500">
                      Admin (7%):{' '}
                      <span className="font-semibold">
                        ₹{weekSummaries[weekKey]?.totalAdmin?.toFixed(2)}
                      </span>
                    </span>
                    <span className="font-medium text-red-500">
                      TDS (3%):{' '}
                      <span className="font-semibold">
                        ₹{weekSummaries[weekKey]?.totalTDS?.toFixed(2)}
                      </span>
                    </span>
                  </div>

                  {/* Pay All button for this week */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayAllForWeek(weekKey);
                    }}
                    className="rounded bg-secondary px-3 py-1 text-xs text-white transition-colors hover:bg-primary"
                  >
                    Pay All ({items.length})
                  </button>
                </div>
              </div>

              {/* Expanded Table */}
              {expandedWeeks.has(weekKey) && (
                <div className="border-t border-stroke p-4">
                  <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr className="bg-gray-2 dark:bg-meta-4">
                          <th className="px-4 py-4 text-left font-medium">Date</th>
                          <th className="px-4 py-4 text-left font-medium">Time</th>
                          <th className="px-4 py-4 text-left font-medium">CRN No</th>
                          <th className="px-4 py-4 text-left font-medium">Full Name</th>
                          <th className="px-4 py-4 text-left font-medium">Phone</th>
                          <th className="px-4 py-4 text-left font-medium">Bank Name</th>
                          <th className="px-4 py-4 text-left font-medium">Account No</th>
                          <th className="px-4 py-4 text-left font-medium">IFSC Code</th>
                          <th className="px-4 py-4 text-left font-medium">Branch</th>
                          <th className="px-4 py-4 text-left font-medium">Amount</th>
                          <th className="px-4 py-4 text-left font-medium text-primary">Payable</th>
                          <th className="px-4 py-4 text-left font-medium text-orange-500">Admin Charges (7%)</th>
                          <th className="px-4 py-4 text-left font-medium text-red-500">TDS (3%)</th>
                          <th className="px-4 py-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((row, index) => (
                          <tr
                            key={row.id || index}
                            className="hover:bg-gray-50 border-b border-stroke dark:border-strokedark"
                          >
                            <td className="px-4 py-2 text-left text-sm">{row.fullDate}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.formattedTime}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.crnNo}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.fullname}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.phoneNumber}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.bankName}</td>
                            <td className="font-mono px-4 py-2 text-left text-sm">{row.bankAccNo}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.bankIFSC}</td>
                            <td className="px-4 py-2 text-left text-sm">{row.bankBranch}</td>
                            <td className="px-4 py-2 text-left text-sm font-semibold">₹{row.amount}</td>
                            <td className="px-4 py-2 text-left text-sm font-medium text-primary">₹{row.payableAmount}</td>
                            <td className="px-4 py-2 text-left text-sm font-medium text-orange-500">
                              ₹{row.adminAmount?.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-left text-sm font-medium text-red-500">
                              ₹{row.tdsAmount?.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-left">
                              <button
                                onClick={() => handlePayClick(row)}
                                className="rounded bg-secondary px-3 py-1 text-xs text-white transition-colors hover:bg-secondary"
                                disabled={isProcessingBulk}
                              >
                                Pay
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pay All Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-999"
      >
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h2 className="text-gray-900 text-lg font-semibold">
            Confirm Payment
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {selectedWeekForPayAll ? (
              <>
                Are you sure you want to pay all commissions for{' '}
                <span className="font-medium">
                  week of {weekDisplayNames[selectedWeekForPayAll]}
                </span>
                ?
                <br />
                <span className="bg-gray-50 mt-2 block rounded p-2">
                  Total records:{' '}
                  <span className="font-bold">{bulkPaymentIds.length}</span>
                  <br />
                  Total amount:{' '}
                  <span className="font-bold">
                    ₹{groupedData[selectedWeekForPayAll]?.reduce(
                      (sum, item) => sum + item.amount,
                      0,
                    ).toFixed(2)}
                  </span>
                </span>
              </>
            ) : (
              <>
                Are you sure you want to pay all commissions (
                <span className="font-bold">{totalRecords}</span> records)
                across all weeks?
              </>
            )}
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={confirmPayAll}
              disabled={isProcessingBulk}
              className="rounded bg-green-500 px-4 py-2 text-sm text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessingBulk ? 'Processing...' : 'Confirm'}
            </button>
            <button
              onClick={closeModal}
              disabled={isProcessingBulk}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DisplayPendingCommisionReport;