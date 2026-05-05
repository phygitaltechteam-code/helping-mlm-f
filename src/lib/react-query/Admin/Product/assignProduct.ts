import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';

export const assignProducts = async (data: {
  crnNo: string;
  productIds: string[];
}) => {
//   const response = await api.post('/admin/assign-product', data);
   const response = await api.post('/order/create', data);
  return response.data;
};

export const useAssignProducts = () => {
  return useMutation({
    mutationFn: assignProducts,
  });
};