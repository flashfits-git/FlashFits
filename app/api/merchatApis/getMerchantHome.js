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
