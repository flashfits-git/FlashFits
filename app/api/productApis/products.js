import api from '../../../axiosConfig';


export const fetchnewArrivalsProductsData = async () => {
//   const response = await api.get('products');
//   return response.data.products; // adjust this based on your backend
  try {
  const res = await api.get('user/products/newArrivals');
  // console.log('jfjf');
  
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

export const productDetailPage = async (id) => {
  // console.log(id);
        try {
        const response = await api.get(`user/products/${id}`);
        // console.log(response.data, 'feedd');
        return response.data
      } catch (error) {
        console.error('Error fetching product:', error);
      }
};

export const getFilteredProducts = async (filters) => {
  try {
    const response = await api.get('user/products/filtered', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
};



