/* eslint-disable */
import React, { useState, useEffect } from 'react';
import GenerationTreeView from '@/components/Network/GenerationTreeView';
import { useGetNetwotkTree } from '@/lib/react-query/network';
import Loader from '@/components/common/Loader';

// Recursive function to find a node by ID in the tree
const findNodeById = (node: any, id: string): any => {
  if (!node) return null;
  if (node.data?.id === id || node.data?.crnNo === id) return node;

  for (const child of node.children || []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
};

const GenerationTreePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTree, setFilteredTree] = useState<any>(null);
  
  const { data: genData, isLoading } = useGetNetwotkTree();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter tree whenever searchTerm changes
  useEffect(() => {
    if (searchTerm && genData) {
      const node = findNodeById(genData, searchTerm);
      setFilteredTree(node);
    } else {
      setFilteredTree(null); // Show full tree if no search
    }
  }, [searchTerm, genData]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2">
      {/* Header */}
      {/* <div className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm dark:border-gray-700 dark:bg-boxdark">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Generation Tree</h1>

        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your direct referral downline — top node with all direct children
        </p>
      </div> */}

      {/* Search Bar */}
     

      {/* Tree */}
      <div className="bg-white dark:bg-boxdark">
         <div className="px-6 py-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter CRN ID, e.g. CRN0000000"
          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-boxdark-2 dark:text-white md:w-1/3"
        />
      </div>
        {isLoading ? <Loader /> : (genData && Object.keys(genData).length > 0 ? <GenerationTreeView network={filteredTree || genData} /> : <div className="p-6 text-center text-gray-500">No tree data found.</div>)}
      </div>
    </div>
  );
};

export default GenerationTreePage;
