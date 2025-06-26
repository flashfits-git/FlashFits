import api from '../../../axiosConfig';


export const fetchnewArrivalsProductsData = async () => {
//   const response = await api.get('products');
//   return response.data.products; // adjust this based on your backend
  try {
  const res = await api.get('user/products/newArrivals');
  return res.data; // adjust this based on your backend

  } catch (error) {
        console.error('Axios error:', error);
    throw error;
  }
};

export const CategoryOfProducts = async () => {

  try {
  const res = await api.get('user/products/CategoryOfProducts');
  return res.data; // adjust this based on your backend

  } catch (error) {
        console.error('Axios error:', error);
    throw error;
  }

}




