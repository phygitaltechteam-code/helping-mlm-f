/* eslint-disable */
import React from 'react';
import { BinaryTreeNode } from '@/components/Network';
import { useGetNetwotkBinaryTree } from '@/lib/react-query/network';
import Loader from '@/components/common/Loader';

// ─── Mock binary tree data ────────────────────────────────────────────────────
const MOCK_BINARY_DATA = {
  name: 'You (Root)',
  data: {
    id: 'ROOT001', first_name: 'You', directSponsorId: '-',
    side: '', isGolden: false, isActive: true,
    leftCount: 2, rightCount: 1, orderStatus: 'ACTIVE',
  },
  children: [
    {
      name: 'Left Member',
      data: {
        id: 'L001', first_name: 'Left Member', directSponsorId: 'ROOT001',
        side: 'LEFT', isGolden: false, isActive: true,
        leftCount: 1, rightCount: 0, orderStatus: 'ACTIVE',
      },
      children: [
        {
          name: 'LL Member',
          data: {
            id: 'LL001', first_name: 'LL Member', directSponsorId: 'L001',
            side: 'LEFT', isGolden: false, isActive: true,
            leftCount: 0, rightCount: 0, orderStatus: 'ACTIVE',
          },
          children: [],
        },
      ],
    },
    {
      name: 'Right Member',
      data: {
        id: 'R001', first_name: 'Right Member', directSponsorId: 'ROOT001',
        side: 'RIGHT', isGolden: true, isActive: true,
        leftCount: 0, rightCount: 0, orderStatus: 'ACTIVE',
      },
      children: [],
    },
  ],
};
// ─────────────────────────────────────────────────────────────────────────────

const HelpingTreePage: React.FC = () => {
  const { data: binaryData, isLoading } = useGetNetwotkBinaryTree();
  const resolvedData = (binaryData && Object.keys(binaryData).length > 0) ? binaryData : MOCK_BINARY_DATA;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Helping Tree</h1>
          {!binaryData && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              Mock Data — Replace with API
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Binary network — Left and Right downline structure
        </p>
      </div>

      {/* Tree */}
      <div className="bg-white dark:bg-boxdark">
        {isLoading ? <Loader /> : <BinaryTreeNode network={resolvedData} />}
      </div>
    </div>
  );
};

export default HelpingTreePage;
