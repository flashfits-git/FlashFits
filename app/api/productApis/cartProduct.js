import api from '../../../axiosConfig';
import * as SecureStore from 'expo-secure-store';


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
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const deleteCartItem = async (itemId, quantity, size) => {
  console.log('itemId sent:', itemId, quantity, size);
  try {
    const res = await api.delete(`admin/cart/delete/${itemId}?quantity=${quantity}&size=${size}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    console.error('Error deleting item from cart:', err);
    throw err;
  }
};


export const clearCart = async () => {
  const token = await SecureStore.getItemAsync('token');
  // console.log(token,'4rg4yg4f4bf4bhf4ubfhu');
  
  const response = await api.delete('user/cart/clear', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};




