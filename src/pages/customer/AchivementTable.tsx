import React from 'react';
import { useGetAchivement } from '@/lib/react-query/Customer/commision';
import GenericTable, { Column } from '@/components/Forms/Table/GenericTable';

type AchievementData = {
  id: string;
  name: string;
  crnNo: string;
  description: string;
  status: string;
  createdAt: string;
  DeliveryDate?: string | null;
  updatedAt?: string;
};

export const AchivementTable = () => {
  const { data, isPending } = useGetAchivement();

  const achievementsList: AchievementData[] = data?.data || [];

  const columns: Column<AchievementData>[] = [
    {
      header: 'CRN No',
      accessor: 'crnNo',
      sortable: true,
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Description',
      accessor: 'description',
    },
     {
      header: 'Achievement Date',
      accessor: 'createdAt',
      render: (item) => (
        <span>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}
        </span>
      ),
    },

    {
      header: 'Delivery Date',
      accessor: 'DeliveryDate',
      render: (item) => (
        <span>
          {item.DeliveryDate ? new Date(item.DeliveryDate).toLocaleDateString('en-IN') : '-'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <div className="flex flex-col gap-1 items-center ">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
              item.status === 'DELIVERED'
                ? 'bg-primary text-white'
                : 'bg-yellow-100 text-primary'
            }`}
          >
            {item.status || 'PENDING'}
          </span>
        </div>
      ),
    },
   
  ];

  if (isPending) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <GenericTable
        title="My Achievements"
        data={achievementsList}
        columns={columns}
        itemsPerPage={15}
        searchAble
      />
    </div>
  );
};
