import {api} from '@/utils/axios';

export const getCustomerAllProducts = async () => {
  try {
    const response = await api.get('/mlm-product');
    return response.data;
  } catch (error) {
    const err = error.response?.data || error;
    console.error('Error fetching products:', err.message);
    throw err;
  }
};

export const getCustomerProductData = async () => {
  try {
    const response = await api.get('/customers/products');
    return response.data;
  } catch (error) {
    const err = error.response?.data || error;
    console.error('Error fetching product data:', err.message);
    throw err;
  }
};