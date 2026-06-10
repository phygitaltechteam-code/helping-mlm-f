import {ProductResponse} from '@/types';
import {useQuery} from '@tanstack/react-query';
import {getCustomerAllProducts, getCustomerProductData} from '@/lib/api/Customer/product';

export const useGetCustomerAllProducts = () => {
  return useQuery<ProductResponse>({
    queryKey: ['products'],
    queryFn: getCustomerAllProducts,
  });
};

export const useGetProductDataCustomer = () => {
  return useQuery<ProductResponse>({
    queryKey: ['product-data'],
    queryFn: getCustomerProductData,
  });
};