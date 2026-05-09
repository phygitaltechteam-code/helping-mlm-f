/*eslint-disable */

import React, { useState, useEffect } from 'react';
import '../app.css';
import { TreeNode } from '@/components/Network';
import { useGetNetwotkTree } from '@/lib/react-query/network';
import { useAuthContext } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

// Recursive function to find node by CRN ID
const findNodeById = (node: any, search: string): any => {
  if (!node) return null;

  const term = search.trim().toLowerCase();

  const id = String(node.data?.id || '').toLowerCase();

  const crnNo = String(node.data?.crnNo || '').toLowerCase();

  const fullname = String(
    node.data?.name ||
    node.data?.first_name ||
    ''
  ).toLowerCase();

  // Match partial search
  if (
    id.includes(term) ||
    crnNo.includes(term) ||
    fullname.includes(term)
  ) {
    return {
      ...node,
      children: node.children || [], // prevent undefined
    };
  }

  for (const child of node.children || []) {
    const found = findNodeById(child, term);

    if (found) {
      return found;
    }
  }

  return null;
};

const Network = () => {
  const { user } = useAuthContext();
  const { data, isSuccess, isPending, isError } = useGetNetwotkTree();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTree, setFilteredTree] = useState<any>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter the tree whenever searchTerm changes
  useEffect(() => {
    if (searchTerm && data) {
      const node = findNodeById(data, searchTerm);
      setFilteredTree(node);
    } else {
      setFilteredTree(null); // Show full tree if search is empty
    }
  }, [searchTerm, data]);

  if (isPending) return <Loader />;
  if (isError)
    return <div className="dottedBackground mx-8">Error loading network.</div>;

  return (
    <>
      {isSuccess && (
        <div>
          {/* Heading */}
          <h1 className="text-2xl font-semibold mb-4">
            Generation Tree
          </h1>

          {/* White Box */}
          <div className="dottedBackground">
            {/* Top padding */}
            <div className="pt-6 px-4">
              <div className="mb-6 mt-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Enter CRN ID, e.g. CRN0000000"
                  className="w-full rounded-md border px-3 py-2 md:w-1/3"
                />
              </div>
            </div>

            {/* Tree Content */}
            <div className="pb-6 px-4">
              {filteredTree ? (
                <TreeNode network={filteredTree} />
              ) : searchTerm ? (
                <div className="text-center py-10 text-gray-500">
                  No matching member found
                </div>
              ) : (
                <TreeNode network={data} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Network;