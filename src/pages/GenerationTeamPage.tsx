/* eslint-disable */
import GenericTable from '@/components/Forms/Table/GenericTable';
import { useGetNetwotkTree } from '@/lib/react-query/network';
import { Column } from '@/types';
import React from 'react';

// ─── Mock data (replace with real API) ───────────────────────────────────────
const MOCK_GENERATION_TEAM = [
  { sNo: 1, name: 'Gen Member A', crnNo: 'CRN2001', joinDate: '2024-01-10', generation: 1, status: 'Active' },
  { sNo: 2, name: 'Gen Member B', crnNo: 'CRN2002', joinDate: '2024-02-18', generation: 1, status: 'Active' },
  { sNo: 3, name: 'Gen Member C', crnNo: 'CRN2003', joinDate: '2024-03-22', generation: 1, status: 'Inactive' },
  { sNo: 4, name: 'Gen Member D', crnNo: 'CRN2004', joinDate: '2024-04-11', generation: 1, status: 'Active' },
];

type Data = {
  name:string,
  crnNo:string,
  joinDate:string,
  generation:number,
  status:string,
};

// ─────────────────────────────────────────────────────────────────────────────
 
const GenerationTeamPage: React.FC = () => {
  const { data: apiResponse, isLoading, error } = useGetNetwotkTree();


   const genColumn: Column<Data>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'CRN No',
      accessor: 'crnNo',
    },
    {
      header: 'Join Date',
      accessor: 'joinDate',
    },
    {
      header: 'Generation',
      accessor: 'generation',
    },
    {
      header: 'Status',
      accessor: 'status',
      Cell: (value: string) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            value === 'Active'
              ? 'bg-green-100 text-green-800'
              : value === 'Inactive'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  const children = apiResponse?.children ||[]
   const tableData = children.map((item):any => ({
  crnNo: item?.data?.crnNo,
  name: item?.name,
  generation: 1,
  status: item?.data?.isActive?"Active":"Inactive",
  joinDate: item?.data?.createdAt==null?"-":item?.data?.createdAt,
}));
  console.log("memebr", tableData);


  return (
    <div className="">
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
        <div className="rounded-xl border border-indigo-100 bg-secondary/10 p-4 dark:border-indigo-900 dark:bg-indigo-900/20">
          <p className="text-xs font-medium uppercase text-secondary">Total Direct Members</p>
          <p className="mt-1 text-2xl font-bold text-secondary dark:text-secondary">{children?.length}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-primary/10 p-4 dark:border-green-900 dark:bg-green-900/20">
          <p className="text-xs font-medium uppercase text-primary">Active Members</p>
          <p className="mt-1 text-2xl font-bold text-primary dark:text-primary">
            {children?.filter((child) => child.data?.isActive)?.length}          </p>
        </div>
      </div>

      {/* Table */}
      <div className=" px-6 py-4 ">
          <h2 className="text-base  text-xl font-bold text-gray-800 ">All Generation Team Members</h2>
        </div>
      <div className="  bg-white shadow-sm  dark:bg-boxdark">
        
    
        {tableData?.length === 0 ? (
        <p className="text-gray-500">No commission data available.</p>
      ) : (
        <GenericTable columns={genColumn} data={tableData} />
      )}
      </div>
   </div>
  );
};

export default GenerationTeamPage;
