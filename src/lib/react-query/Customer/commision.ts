import { getCustomer, getCommission } from '@/lib/api/Customer/home';
import { Customer, Commission } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_DASHBOARD_QUERY_KEYS, CUSTOMER_QUERY_KEYS } from '../QueryKeys';
import { approveAchievement, getAchivement, getDirectCustomer } from '@/lib/api/Customer/commission';
import toast from 'react-hot-toast';

// Fetch customer details hook
export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: [CUSTOMER_QUERY_KEYS.CUSTOMER],
    queryFn: () => getCustomer(id),
  });
};

// Fetch customer commissions hook
export const useGetCommission = (id: string) => {
  return useQuery({
    queryKey: [CUSTOMER_QUERY_KEYS.COMMISSION],
    queryFn: () => getCommission(id),
  });
};

export const useGetDirectCustomer = () => {
  return useQuery({
    queryKey: ['direct-customer'],
    queryFn: () => getDirectCustomer(),
  });
};

// Approve an achievement — mutation (PUT side-effect)
export const useApproveAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADMIN_DASHBOARD_QUERY_KEYS.CUSTOMER_LIST] });
      toast.success("Achievement approved successfully");
    },
    onError: () => {
      toast.error("Failed to approve achievement");
    }
  });
};


export const useGetAchivement = () => {
  return useQuery({
    queryKey: ['customer-achivement'],
    queryFn: () => getAchivement(),
  });
};

