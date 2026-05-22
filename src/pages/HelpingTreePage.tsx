/* eslint-disable */
import React from 'react';
import { BinaryTreeNode } from '@/components/Network';
import { useGetNetwotkBinaryTree } from '@/lib/react-query/network';
import Loader from '@/components/common/Loader';



const HelpingTreePage: React.FC = () => {
  const { data: binaryData, isLoading } = useGetNetwotkBinaryTree();


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Header */}
      <div className=" bg-white px-6 py-5 shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Upgrade Tree</h1>

        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Binary network — Left and Right downline structure
        </p>
      </div>

      {/* Tree */}
      <div className="bg-white dark:bg-boxdark">
        {isLoading ? <Loader /> : (binaryData && Object.keys(binaryData).length > 0 ? <BinaryTreeNode network={binaryData} /> : <div className="p-6 text-center text-gray-500">No tree data found.</div>)}
      </div>
    </div>
  );
};

export default HelpingTreePage;
