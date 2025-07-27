import api from '../../../axiosConfig';


export const AddProducttoCart = async (productData) => {
  // console.log(productData,'DFD');
  
  try {
    const response = await api.post('user/cart/add', productData); // replace '/cart/add' with your actual endpoint
    console.log(response.data,'33333333333333333');
    
    return response.data;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    throw error;
  }
};

export const GetCart = async () => {
  console.log('Fetching cart...');
  
  try {
    const response = await api.get('user/cart'); // Make sure this matches your backend route
    // console.log(response.data, 'Fetched Cart ✅');
    console.log(response);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const deleteCartItem = async (itemId) => {
  console.log('itemId sent:', itemId);
  
  try {
    const res = await api.delete(`admin/cart/delete/${itemId}`);
    console.log(res.data);
    
    return res.data;
  } catch (err) {
    console.error('Error deleting item from cart:', err);
    throw err;
  }
};

