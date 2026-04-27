/* eslint-disable */
import React from 'react';
import GenerationTreeView from '@/components/Network/GenerationTreeView';
import { useGetNetwotkTree } from '@/lib/react-query/network';
import Loader from '@/components/common/Loader';

// ─── Mock generation tree data ────────────────────────────────────────────────
const MOCK_GEN_DATA = {
  name: 'You (Root)',
  data: {
    username: 'you', id: 'ROOT001', first_name: 'You',
    sponserer_username: '-', isGolden: false, isActive: true,
  },
  children: [
    {
      name: 'Gen Member A',
      data: { username: 'gena', id: 'G001', first_name: 'Gen Member A', sponserer_username: 'you', isGolden: false, isActive: true },
      children: [],
    },
    {
      name: 'Gen Member B',
      data: { username: 'genb', id: 'G002', first_name: 'Gen Member B', sponserer_username: 'you', isGolden: true, isActive: true },
      children: [],
    },
    {
      name: 'Gen Member C',
      data: { username: 'genc', id: 'G003', first_name: 'Gen Member C', sponserer_username: 'you', isGolden: false, isActive: false },
      children: [],
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

const GenerationTreePage: React.FC = () => {
  const { data: genData, isLoading } = useGetNetwotkTree();
  const resolvedData = (genData && Object.keys(genData).length > 0) ? genData : MOCK_GEN_DATA;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Generation Tree</h1>
          {!genData && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              Mock Data — Replace with API
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your direct referral downline — top node with all direct children
        </p>
      </div>

      {/* Tree */}
      <div className="bg-white dark:bg-boxdark">
        {isLoading ? <Loader /> : <GenerationTreeView network={resolvedData as any} />}
      </div>
    </div>
  );
};

export default GenerationTreePage;
