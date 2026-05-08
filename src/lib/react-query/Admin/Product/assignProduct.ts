import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';

export const assignProducts = async (data: any) => {
  const response = await api.post('/admin/customers/activate', data);
  return response.data;
};

export const useAssignProducts = () => {
  return useMutation({
    mutationFn: assignProducts,
  });
};