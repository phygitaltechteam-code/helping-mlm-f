/*eslint-disable */

import React, {useState, useEffect} from 'react';
import {
  useGetNetwotkPoolTree,
  useGetNetwotkPoolTreeCount,
} from '@/lib/react-query/network';
import Loader from '@/components/common/Loader';
import BinaryTreeNode from '@/components/Network/BinaryTreeNode';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import {useForm, FormProvider} from 'react-hook-form';

const findNodeById = (node: any, search: string): any => {
  if (!node) return null;

  const term = search.trim().toLowerCase();

  const id = String(node.data?.id || '').toLowerCase();

  const crnNo = String(node.data?.crnNo || '').toLowerCase();

  const fullname = String(
    node.data?.name || node.data?.first_name || '',
  ).toLowerCase();

  if (id.includes(term) || crnNo.includes(term) || fullname.includes(term)) {
    return node;
  }

  for (const child of node.children || []) {
    const found = findNodeById(child, term);

    if (found) return found;
  }

  return null;
};

const BinaryTree = () => {
  const methods = useForm({
    defaultValues: {
      idNo: '1',
    },
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<{value: string; label: string}[]>([
    {value: '1', label: '1'},
  ]);
  const [IdNo, setIdNo] = useState(1);
  const [filteredTree, setFilteredTree] = useState<any>(null);

  const {data, isSuccess, isPending, isError, refetch} =
    useGetNetwotkPoolTree(IdNo);
  const {
    data: countData,
    isSuccess: countIsSuccess,
    isPending: countIsPending,
    isError: countIsError,
  } = useGetNetwotkPoolTreeCount();
  console.log('countData', countData);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleIdNoChange = (value: string) => {
    setIdNo(Number(value));
  };
  // Filter tree whenever searchTerm changes
  useEffect(() => {
    if (searchTerm && data) {
      const node = findNodeById(data, searchTerm);
      setFilteredTree(node);
    } else {
      setFilteredTree(null); // Show full tree if no search
    }
  }, [searchTerm, data]);
  useEffect(() => {
    if (searchTerm === '' && data) {
      refetch();
    }
  }, [IdNo]);
  // Dynamically set dropdown options based on poolCount
  useEffect(() => {
    if (countData) {
      const rawCount =
        typeof countData === 'number'
          ? countData
          : (countData.count ?? countData.poolCount ?? 1);

      const count = Number(rawCount);
      if (!isNaN(count) && count > 0) {
        const generatedOptions = Array.from({length: count}, (_, i) => ({
          value: String(i + 1),
          label: String(i + 1),
        }));
        setOptions(generatedOptions);
      }
    }
  }, [countData]);
  if (isPending) return <Loader />;
  if (isError)
    return <div className="dottedBackground mx-8">Error loading network.</div>;

  return (
    <FormProvider {...methods}>
      {isSuccess && (
        <div>
          {/* Heading */}
          <h1 className="mb-4 text-2xl font-semibold">Pool Tree</h1>

          <div className="dottedBackground">
            {/* Top padding */}
            <div className="px-4 pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start">
                <div className="w-full md:w-1/3">
                  <GenericInputField
                    name="search"
                    label="Search Member"
                    placeholder="Enter ID, CRN or Name"
                    onChange={(val) => setSearchTerm(val)}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <GenericDropdown
                    name="idNo"
                    label="Id No"
                    options={options}
                    onChange={handleIdNoChange}
                  />
                </div>
              </div>
            </div>

            {/* Tree Content */}
            <div className="px-4 pb-6">
              <BinaryTreeNode network={filteredTree || data} />
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  );
};

export default BinaryTree;
