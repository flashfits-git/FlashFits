import api from '../../../axiosConfig';


export const AddProducttoCart = async (productData) => {
  // console.log(productData,'DFD');
  
  try {
    const response = await api.post('admin/cart/add', productData); // replace '/cart/add' with your actual endpoint
    console.log(response.data,'33333333333333333');
    
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
};

export const GetCart = async () => {
  try {
    const response = await api.get('admin/cart'); // Make sure this matches your backend route
    console.log(response.data, 'Fetched Cart ✅');
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};
