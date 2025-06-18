import api from '../../../axiosConfig';


export const fetchProductsData = async () => {
//   const response = await api.get('products');
//   return response.data.products; // adjust this based on your backend
  try {
  // const res = await api.get('user/products/newArrivals');
    const res = await api.get('admin/getCategories');
  return res.data.categories; // adjust this based on your backend

  } catch (error) {
        console.error('Axios error:', error);
    throw error;
  }
};