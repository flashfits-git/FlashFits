import api from '../../axiosConfig';

export const createOrder = async () => {
  try {
    const res = await api.post('/user/order/create');
    return res.data;
  } catch (error) { 
    console.error('Axios error:', error);
    throw error;
  }
};
