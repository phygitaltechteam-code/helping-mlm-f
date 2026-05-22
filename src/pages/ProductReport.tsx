/* eslint-disable */
import React, {useState} from 'react';
import {
  useDeliveredReport,
  useGetAllProductsReport,
} from '@/lib/react-query/Admin/Product/products';
import {CheckmarkIcon} from 'react-hot-toast';
import {useNavigate} from '@tanstack/react-router';

const ProductReport = () => {
  const navigate = useNavigate();

  // Destructure isLoading and isError to handle API states properly
  const {
    data: productData,
    isLoading,
    isError,
    refetch: refetchProductReport,
  } = useGetAllProductsReport();

  const {mutate: approveDeliveredRequest} = useDeliveredReport();

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // NEW: State for search query
  const [searchQuery, setSearchQuery] = useState('');

  // --- EXTRACT ALL DATA (NO FILTERING YET) ---
  let allData: any[] = [];

  if (Array.isArray(productData)) {
    allData = productData;
  } else if (productData?.data && Array.isArray(productData.data)) {
    allData = productData.data;
  } else if (productData?.product) {
    allData = [productData.product];
  } else if (productData && productData.id) {
    allData = [productData];
  }

  // --- NEW: FILTER DATA BASED ON SEARCH QUERY ---
  const filteredData = allData.filter((item: any) => {
    if (!searchQuery) return true; // If no search, show all
    
    const query = searchQuery.toLowerCase();
    
    // Safely extract the same fields you use in the table to search against them
    const crnNo = String(item?.crnNo || item?.customer?.crnNo || item?.customer?.MLMData?.crnNo || '').toLowerCase();
    const fullname = String(item?.fullname || item?.customer?.user?.fullname || item?.customer?.name || '').toLowerCase();
    const phoneNumber = String(item?.phoneNumber || item?.customer?.user?.phoneNumber || '').toLowerCase();
    const name = String(item?.name || item?.product?.name || item?.description || '').toLowerCase();

    return (
      crnNo.includes(query) ||
      fullname.includes(query) ||
      phoneNumber.includes(query) ||
      name.includes(query)
    );
  });

  // Debug: log raw data to help trace missing rows
  console.log('ProductReport - raw productData:', productData);

  const handleDelivery = (id: string, customerName: string) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to confirm delivery to ${customerName}?`,
    );

    if (isConfirmed) {
      approveDeliveredRequest(id);
    }
  };

  // Sort data
  const getSortValue = (obj: any, field: string) => {
    if (!obj) return '';
    // prefer direct field, then nested product/customer
    const val =
      obj[field] ??
      obj.product?.[field] ??
      obj.customer?.[field] ??
      obj.customer?.user?.[field];
    if (val === undefined || val === null) return '';
    // For dates, convert to timestamp for numeric sort
    if (
      field.toLowerCase().includes('date') ||
      field.toLowerCase().includes('createdat') ||
      field.toLowerCase().includes('createdAt')
    ) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    }
    return String(val).toLowerCase();
  };

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    const va = getSortValue(a, sortField);
    const vb = getSortValue(b, sortField);
    if (va < vb) return sortDirection === 'asc' ? -1 : 1;
    if (va > vb) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil((sortedData?.length || 0) / recordsPerPage);
  const paginatedData = sortedData?.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  // Detect items missing expected fields
  const itemsMissingFields = (filteredData || []).filter((item: any) => {
    return (
      !item ||
      !item.id ||
      !item.createdAt ||
      (!item.fullname && !item.customer && !item.product)
    );
  });
  if (itemsMissingFields.length > 0) {
    console.warn(
      'ProductReport - items missing key fields:',
      itemsMissingFields,
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // --- UI STATES ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 text-lg font-medium">
          Loading product data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-red-500">
          Failed to load data. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="p-1">
      {/* Header with title, search, and buttons */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold dark:text-white">
          Product Deliverd List
        </h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          
          {/* NEW: Search Bar Input */}
          <input
            type="text"
            placeholder="Search CRN, Name, Phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to page 1 when searching
            }}
            className="rounded border border-stroke bg-white px-3 py-1.5 text-sm outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
          />

          <button
            className="
              w-full sm:w-auto
              rounded
              bg-secondary
              px-3 py-1.5
              text-sm sm:text-base
              text-white
              transition-colors
              hover:bg-secondary
            "
            onClick={() => navigate({to: '/admin/deliverdproducts'})}
          >
            Show History
          </button>
          <button
            className="rounded border border-blue-500 px-3 py-1.5 text-sm sm:text-base text-blue-500 transition-colors hover:bg-primary/5"
            onClick={async () => {
              console.log('Manual refresh: fetching product report');
              try {
                const res = await refetchProductReport();
                console.log('Refetch result:', res);
              } catch (err) {
                console.error('Refetch failed:', err);
              }
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-sm bg-white px-5 pb-2.5 pt-6 shadow-default dark:bg-boxdark">
        {filteredData.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 py-8 text-center">
            {searchQuery ? 'No deliveries match your search.' : 'No deliveries found in the database.'}
          </div>
        ) : (
          <>
            <div className="max-w-full overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    {[
                      {label: 'Sr', key: 'sr'},
                      {label: 'CRN No', key: 'crnNo'},
                      {label: 'Customer Name', key: 'fullname'},
                      {label: 'Phone Number', key: 'phoneNumber'},
                      {label: 'Product Name', key: 'name'},
                      {label: 'Date & Time', key: 'createdAt'},
                      {label: 'Price', key: 'discountedPrice'},
                      {label: 'Status', key: 'orderStatus'},
                      {label: 'Action', key: 'action'},
                    ].map((column) => (
                      <th
                        key={column.key}
                        className="cursor-pointer px-4 py-4 font-medium text-black dark:text-white"
                        onClick={() =>
                          column.key !== 'action' && column.key !== 'sr' && handleSort(column.key)
                        }
                      >
                        <div className="flex items-center">
                          {column.label}
                          {sortField === column.key && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item: any, index: number) => {
                    const id =
                      item?.id ||
                      item?._id ||
                      `${item?.product?.id || 'no-product'}-${item?.customer?.crnNo || 'no-crn'}-${index}`;
                    const crnNo =
                      item?.crnNo ||
                      item?.customer?.crnNo ||
                      item?.customer?.MLMData?.crnNo ||
                      'N/A';
                    const fullname =
                      item?.fullname ||
                      item?.customer?.user?.fullname ||
                      item?.customer?.name ||
                      'Unknown';
                    const phoneNumber =
                      item?.phoneNumber ||
                      item?.customer?.user?.phoneNumber ||
                      'N/A';
                    const name =
                      item?.name ||
                      item?.product?.name ||
                      item?.description ||
                      'Unknown';
                    const discountedPrice =
                      item?.discountedPrice ??
                      item?.product?.discountedPrice ??
                      0;
                    const status =
                      item?.orderStatus || item?.status || 'PENDING';

                    let createdAtStr = 'N/A';
                    const createdCandidates = [
                      item?.assignedAt,
                      item?.assigned_at,
                      item?.updatedAt,
                      item?.updated_at,
                      item?.createdAt,
                      item?.created_at,
                      item?.product?.createdAt,
                    ];

                    const parseDateValue = (val: any) => {
                      if (!val && val !== 0) return null;
                      let n =
                        typeof val === 'string' && /^\d+$/.test(val)
                          ? Number(val)
                          : val;
                      if (typeof n === 'number') {
                        if (n < 1e11) n = n * 1000;
                        const dd = new Date(n);
                        return isNaN(dd.getTime()) ? null : dd;
                      }
                      const dd = new Date(val);
                      return isNaN(dd.getTime()) ? null : dd;
                    };

                    let parsedDate: Date | null = null;
                    for (const cand of createdCandidates) {
                      const pd = parseDateValue(cand);
                      if (pd) {
                        parsedDate = pd;
                        break;
                      }
                    }

                    if (parsedDate) {
                      createdAtStr = parsedDate.toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      });
                    }

                    const isPending =
                      String(status).toUpperCase() === 'PENDING';

                    return (
                      <tr
                        key={id}
                        className="hover:bg-gray-50 dark:hover:bg-boxhoverdark"
                      >
                        <td className="px-4 py-4 dark:text-white font-medium">
                          {(currentPage - 1) * recordsPerPage + index + 1}
                        </td>
                        <td className="px-4 py-4 dark:text-white">{crnNo}</td>
                        <td className="px-4 py-4 font-medium dark:text-white">
                          {fullname}
                        </td>
                        <td className="px-4 py-4 dark:text-white">
                          {phoneNumber}
                        </td>
                        <td className="px-4 py-4 dark:text-white">{name}</td>
                        <td className="px-4 py-4 dark:text-white">
                          {createdAtStr}
                        </td>
                        <td className="px-4 py-4 dark:text-white">
                          {formatCurrency(Number(discountedPrice) || 0)}
                        </td>
                        <td className="px-4 py-4 dark:text-white">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              isPending
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {String(status).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 dark:text-white">
                          {isPending ? (
                            <button
                              onClick={() =>
                                handleDelivery(item.id || id, fullname)
                              }
                              className="flex transform items-center gap-2 rounded bg-secondary px-3 py-2 text-sm font-medium text-white shadow transition-all hover:bg-secondary/80 active:scale-95"
                              title="Confirm you have given the product to the user"
                            >
                              <CheckmarkIcon className="h-4 w-4" />
                              Confirm
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm font-medium italic">
                              Delivered
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                Showing {(currentPage - 1) * recordsPerPage + 1} to{' '}
                {Math.min(currentPage * recordsPerPage, filteredData.length)} of{' '}
                {filteredData.length} entries
              </div>
              <div className="flex space-x-2">
                <button
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 rounded border bg-white px-2 py-0.5 text-sm dark:bg-boxdark"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="border-gray-300 bg-gray-100 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded border px-2 py-0.5 text-sm dark:bg-boxdark">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 rounded border bg-white px-2 py-0.5 text-sm dark:bg-boxdark"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReport;