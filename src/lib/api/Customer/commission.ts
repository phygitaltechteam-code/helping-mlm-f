import {api} from '@/utils/axios';

// Fetch customer details by ID
export const getCustomer = async (id) => {
  try {
    const {data} = await api.get(`/customer/home/${id}`);
    return data;
  } catch (error) {
    const {response} = error;
    console.error(
      'Error fetching customer:',
      response?.data.message || error.message,
    );
    throw error;
  }
};

// Fetch commissions by customer ID
export const getCommission = async (id) => {
  try {
    const {data} = await api.get(`/customer/commission/${id}`);
    return data;
  } catch (error) {
    const {response} = error;
    console.error(
      'Error fetching commissions:',
      response?.data.message || error.message,
    );
    throw error;
  }
};

export const getDirectCustomer = async () => {
  try {
    const {data} = await api.get(`/customers/directCustomers`);
    return data;
  } catch (error) {
    const {response} = error;
    console.error(
      'Error fetching direct customer:',
      response?.data.message || error.message,
    );
    throw error;
  }
};

// Approve an achievement (POST request)
export const approveAchievement = async (achievementId) => {
  try {
    const {data} = await api.put(`/admin/achievement/deliver/${achievementId}`,{});
    console.log("🚀 ~ approveAchievement ~ data:", data)
    return data
  } catch (error) {
    const {response} = error;
    console.error(
      'Error approving achievement:',
      response?.data.message || error.message,
    );
    throw error;
  }
};


export const getAchivement = async () => {
  try {
    const data = await api.get(`/customers/achievements`);

    return data;
  } catch (error) {
    const {response} = error;
    console.error(
      'Error fetching achivement:',
      response?.data.message || error.message,
    );
    throw error;
  }
};




