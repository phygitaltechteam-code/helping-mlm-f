/* eslint-disable */
import { useGetNetwotkTree } from '@/lib/react-query/network';
import React from 'react';

// ─── Mock data (replace with real API) ───────────────────────────────────────
const MOCK_GENERATION_TEAM = [
  { sNo: 1, name: 'Gen Member A', crnNo: 'CRN2001', joinDate: '2024-01-10', generation: 1, status: 'Active' },
  { sNo: 2, name: 'Gen Member B', crnNo: 'CRN2002', joinDate: '2024-02-18', generation: 1, status: 'Active' },
  { sNo: 3, name: 'Gen Member C', crnNo: 'CRN2003', joinDate: '2024-03-22', generation: 1, status: 'Inactive' },
  { sNo: 4, name: 'Gen Member D', crnNo: 'CRN2004', joinDate: '2024-04-11', generation: 1, status: 'Active' },
];
// ─────────────────────────────────────────────────────────────────────────────

const GenerationTeamPage: React.FC = () => {
  const { data: apiResponse, isLoading, error } = useGetNetwotkTree();

  const children = apiResponse?.children
  console.log("memebr", children);


  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Generation Team</h1>
          
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your direct referral team members
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-900/20">
          <p className="text-xs font-medium uppercase text-indigo-500">Total Direct Members</p>
          <p className="mt-1 text-2xl font-bold text-indigo-700 dark:text-indigo-400">{children?.length}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-xs font-medium uppercase text-green-500">Active Members</p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-400">
            {children?.filter((child) => child.data?.isActive)?.length}          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">All Generation Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                {['S.No', 'Name', 'CRN No', 'Join Date', 'Generation', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {children?.map((row , index) => (
                <tr key={row?.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-5 py-3  text-gray-400">{index + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{row.name}</td>
                  <td className="px-5 py-3 font-mono text-gray-600 dark:text-gray-300">{row.data?.crnNo}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.data?.joinDate}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      Gen {row.generation}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.data?.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                      }`}>
                      {row.data?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
      </div>
    </div>
  );
};

export default GenerationTeamPage;
