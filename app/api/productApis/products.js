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
    const response = await api.post('user/products/filtered', filters); // 🔄 POST and pass filters in body
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
};

export const getYouMayLikeProducts = async (merchantId, subSubCategoryId) => {
 
  // console.log(merchantId,subSubCategoryId,'subSubCategoryId._idsubSubCategoryId._id');

  try {
    const res = await api.get('user/products/getYouMayLikeProducts', {
      params: {
        merchantId,
        subSubCategoryId,
      },
    });
    // console.log(res.data,'566y');
    
    return res.data;
  } catch (error) {
    console.error('Axios error in getYouMayLikeProducts:', error);
    throw error;
  }
};

export const addToWishlist = async (productId, variantId) => {
  console.log(productId,variantId)
  
  try {
    const res = await api.post('user/wishlist/add', { productId, variantId });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const res = await api.delete(`user/wishlist/delete/${wishlistItemId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


// =============================
// 🟦 Get current user's wishlist
// =============================
export const getMyWishlist = async () => {
  try {
    const res = await api.get('user/wishlist/my');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};




