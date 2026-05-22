/* eslint-disable */
import React from 'react';

// ─── Mock data (replace with real API) ───────────────────────────────────────
const MOCK_HELPING_TEAM = [
  { sNo: 1, name: 'Member Alpha', crnNo: 'CRN1001', joinDate: '2024-01-15', side: 'LEFT',  level: 2, status: 'Active' },
  { sNo: 2, name: 'Member Beta',  crnNo: 'CRN1002', joinDate: '2024-02-20', side: 'RIGHT', level: 1, status: 'Active' },
  { sNo: 3, name: 'Member Gamma', crnNo: 'CRN1003', joinDate: '2024-03-10', side: 'LEFT',  level: 3, status: 'Inactive' },
  { sNo: 4, name: 'Member Delta', crnNo: 'CRN1004', joinDate: '2024-04-05', side: 'RIGHT', level: 2, status: 'Active' },
  { sNo: 5, name: 'Member Epsilon',crnNo: 'CRN1005', joinDate: '2024-04-18', side: 'LEFT', level: 1, status: 'Active' },
];
// ─────────────────────────────────────────────────────────────────────────────

const HelpingTeamPage: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Helping Team</h1>
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
            Mock Data — Replace with API
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your binary network downline members (Left & Right)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-blue-100 bg-primary/5 p-4 dark:border-blue-900 dark:bg-blue-900/20">
          <p className="text-xs font-medium uppercase text-blue-500">Total Members</p>
          <p className="mt-1 text-2xl font-bold text-blue-700 dark:text-primary/80">{MOCK_HELPING_TEAM.length}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-xs font-medium uppercase text-green-500">Left Side</p>
          <p className="mt-1 text-2xl font-bold text-green-700 dark:text-green-400">
            {MOCK_HELPING_TEAM.filter((m) => m.side === 'LEFT').length}
          </p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-900/20">
          <p className="text-xs font-medium uppercase text-purple-500">Right Side</p>
          <p className="mt-1 text-2xl font-bold text-purple-700 dark:text-purple-400">
            {MOCK_HELPING_TEAM.filter((m) => m.side === 'RIGHT').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">All Helping Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                {['S.No', 'Name', 'CRN No', 'Join Date', 'Side', 'Level', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {MOCK_HELPING_TEAM.map((row) => (
                <tr key={row.sNo} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-5 py-3 text-gray-400">{row.sNo}</td>
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{row.name}</td>
                  <td className="px-5 py-3 font-mono text-gray-600 dark:text-gray-300">{row.crnNo}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.joinDate}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      row.side === 'LEFT'
                        ? 'bg-primary/10 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    }`}>
                      {row.side}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-300">Level {row.level}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      row.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t px-6 py-3 text-xs text-gray-400 dark:border-gray-700">
          Showing {MOCK_HELPING_TEAM.length} members — connect API when ready
        </div>
      </div>
    </div>
  );
};

export default HelpingTeamPage;
