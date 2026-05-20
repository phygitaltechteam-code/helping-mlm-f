import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axios';

export const assignProducts = async (data: any) => {
  const response = await api.post('/admin/customers/activate', data);
  console.log('assignProducts response:', response.data);
  return response.data;
};

export const useAssignProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignProducts,
    onSuccess: () => {
      // Refresh the products report so newly assigned products appear
      queryClient.invalidateQueries({ queryKey: ['products-report'] });
      // Also invalidate the main products list in case it is used elsewhere
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      console.error('Failed to assign product:', err);
    },
  });
};