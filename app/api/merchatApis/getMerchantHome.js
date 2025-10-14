import api from '../../../axiosConfig';

export const getMerchants = async () => {
  try {
    const response = await api.get('admin/getMerchants');
    return response.data; // Adjust if your API wraps it like { data: { merchants: [...] } }
  } catch (error) {
    console.error('Failed to fetch merchants:', error);
    throw error; // Forward error to the calling function to handle
  }
};

export const getMerchantById = async (id: string) => {
  try {
    const response = await api.get(`/admin/getMerchant/${id}`);
    return response.data; // Adjust if your backend wraps it inside another key
  } catch (error) {
    console.error(`Failed to fetch merchant with ID ${id}:`, error);
    throw error;
  }
};

export const getProductsBatch = async (merchantIds) => {

  try {
  const response = await api.post('user/products/batch', { merchantIds });
  return response.data; // Returns { merchantId1: [products], ... }    
  } catch (error) {
    console.error(`Failed to fetch :`, error);
    throw error;
  }

};

export const getProductsByMerchantId = async (merchantId: string) => {
  try {
    const response = await api.get(`user/products/merchant/${merchantId}`);
    return response.data.products; // ✅ return only the array
  } catch (error) {
    console.error(`Failed to fetch products for merchant ${merchantId}:`, error);
    throw error;
  }
};