/* eslint-disable */
import React, { useState } from 'react';
import { BinaryTreeNode, TreeNode } from '@/components/Network';
import GenerationTreeView from '@/components/Network/GenerationTreeView';
import { useGetNetwotkTree, useGetNetwotkBinaryTree } from '@/lib/react-query/network';
import { useAuthContext } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';



// ─── Mock team table data ─────────────────────────────────────────────────────
const MOCK_HELPING_TEAM = [
  { sNo: 1, name: 'Member Alpha', crnNo: 'CRN1001', joinDate: '2024-01-15', side: 'LEFT', level: 2, status: 'Active' },
  { sNo: 2, name: 'Member Beta', crnNo: 'CRN1002', joinDate: '2024-02-20', side: 'RIGHT', level: 1, status: 'Active' },
  { sNo: 3, name: 'Member Gamma', crnNo: 'CRN1003', joinDate: '2024-03-10', side: 'LEFT', level: 3, status: 'Inactive' },
  { sNo: 4, name: 'Member Delta', crnNo: 'CRN1004', joinDate: '2024-04-05', side: 'RIGHT', level: 2, status: 'Active' },
];

const MOCK_GENERATION_TEAM = [
  { sNo: 1, name: 'Gen Member A', crnNo: 'CRN2001', joinDate: '2024-01-10', generation: 1, status: 'Active' },
  { sNo: 2, name: 'Gen Member B', crnNo: 'CRN2002', joinDate: '2024-02-18', generation: 1, status: 'Active' },
  { sNo: 3, name: 'Gen Member C', crnNo: 'CRN2003', joinDate: '2024-03-22', generation: 1, status: 'Inactive' },
];
// ─────────────────────────────────────────────────────────────────────────────

type MainTab = 'myTree' | 'myTeam';
type TreeSubTab = 'helping' | 'generation';
type TeamSubTab = 'helpingTeam' | 'generationTeam';

const TAB_CLASSES = {
  active: 'border-b-2 border-primary bg-primary/10 text-primary font-semibold',
  inactive: 'text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400',
};

const SUBTAB_CLASSES = {
  active: 'bg-primary text-white shadow',
  inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/20',
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
    status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
  }`}>{status}</span>
);



const MyNetworkPage: React.FC = () => {
  const [mainTab, setMainTab] = useState<MainTab>('myTree');
  const [treeSubTab, setTreeSubTab] = useState<TreeSubTab>('helping');
  const [teamSubTab, setTeamSubTab] = useState<TeamSubTab>('helpingTeam');

  const { user } = useAuthContext();

  // Attempt to fetch real data — fall back to mock if empty/error
  const { data: binaryData, isLoading: binaryLoading } = useGetNetwotkBinaryTree();
  const { data: genData, isLoading: genLoading } = useGetNetwotkTree();



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Network</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your downline trees and team members
        </p>
      </div>

      {/* Main Tabs */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-boxdark">
        <nav className="flex gap-1 px-6" aria-label="Main Tabs">
          {[
            { key: 'myTree', label: 'My Tree' },
            { key: 'myTeam', label: 'My Team' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key as MainTab)}
              className={`px-6 py-4 text-sm transition-all duration-200 ${
                mainTab === tab.key ? TAB_CLASSES.active : TAB_CLASSES.inactive
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── MY TREE SECTION ───────────────────────────────────────────────────── */}
      {mainTab === 'myTree' && (
        <div>
          {/* Sub Tabs */}
          <div className="flex gap-3 bg-white px-6 py-4 shadow-sm dark:bg-boxdark">
            {[
              { key: 'helping', label: 'Helping Tree (Binary)' },
              { key: 'generation', label: 'Generation Tree' },
            ].map((sub) => (
              <button
                key={sub.key}
                onClick={() => setTreeSubTab(sub.key as TreeSubTab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  treeSubTab === sub.key ? SUBTAB_CLASSES.active : SUBTAB_CLASSES.inactive
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Tree Content */}
          <div className="mt-2 bg-white dark:bg-boxdark">
            {treeSubTab === 'helping' && (
              <div>
                <div className="flex items-center gap-2 border-b px-6 py-3 dark:border-gray-700">
                  <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Helping Tree — Binary View (Left / Right)
                  </h2>
                </div>
                {binaryLoading ? <Loader /> : (binaryData && Object.keys(binaryData).length > 0 ? <BinaryTreeNode network={binaryData} /> : <div className="p-6 text-center text-gray-500">No tree data found.</div>)}
              </div>
            )}

            {treeSubTab === 'generation' && (
              <div>
                <div className="flex items-center gap-2 border-b px-6 py-3 dark:border-gray-700">
                  <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Generation Tree — Direct Downline
                  </h2>
                </div>
                {genLoading ? <Loader /> : (genData && Object.keys(genData).length > 0 ? <GenerationTreeView network={genData as any} /> : <div className="p-6 text-center text-gray-500">No tree data found.</div>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MY TEAM SECTION ───────────────────────────────────────────────────── */}
      {mainTab === 'myTeam' && (
        <div className="p-6">
          {/* Sub Tabs */}
          <div className="mb-6 flex gap-3">
            {[
              { key: 'helpingTeam', label: 'Helping Team' },
              { key: 'generationTeam', label: 'Generation Team' },
            ].map((sub) => (
              <button
                key={sub.key}
                onClick={() => setTeamSubTab(sub.key as TeamSubTab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  teamSubTab === sub.key ? SUBTAB_CLASSES.active : SUBTAB_CLASSES.inactive
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* ── Helping Team Table ── */}
          {teamSubTab === 'helpingTeam' && (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-boxdark">
              <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                <div>
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                    Helping Team
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Your binary network downline members
                  </p>
                </div>
                <MockBadge />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      {['S.No', 'Name', 'CRN No', 'Join Date', 'Side', 'Level', 'Status'].map((h) => (
                        <th key={h} className="px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {MOCK_HELPING_TEAM.map((row) => (
                      <tr key={row.sNo} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-5 py-3 text-gray-500">{row.sNo}</td>
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{row.name}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.crnNo}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.joinDate}</td>
                        <td className="px-5 py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            row.side === 'LEFT'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>{row.side}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">L{row.level}</td>
                        <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t px-6 py-3 text-xs text-gray-400 dark:border-gray-700">
                Showing {MOCK_HELPING_TEAM.length} members (mock data — connect API when ready)
              </div>
            </div>
          )}

          {/* ── Generation Team Table ── */}
          {teamSubTab === 'generationTeam' && (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-boxdark">
              <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-700">
                <div>
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white">
                    Generation Team
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Your direct referral downline members
                  </p>
                </div>
                <MockBadge />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                      {['S.No', 'Name', 'CRN No', 'Join Date', 'Generation', 'Status'].map((h) => (
                        <th key={h} className="px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {MOCK_GENERATION_TEAM.map((row) => (
                      <tr key={row.sNo} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-5 py-3 text-gray-500">{row.sNo}</td>
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{row.name}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.crnNo}</td>
                        <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{row.joinDate}</td>
                        <td className="px-5 py-3">
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                            Gen {row.generation}
                          </span>
                        </td>
                        <td className="px-5 py-3"><StatusBadge status={row.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t px-6 py-3 text-xs text-gray-400 dark:border-gray-700">
                Showing {MOCK_GENERATION_TEAM.length} members (mock data — connect API when ready)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyNetworkPage;
