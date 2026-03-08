import api from '../../../axiosConfig';

export const fetchnewArrivalsProductsData = async () => {
    try {
        const res = await api.get('user/products/newArrivals');
        return res.data;
    } catch (error) {
        console.error('Axios error:', error);
        throw error;
    }
};

export const CategoryOfProducts = async () => {
    try {
        const res = await api.get('user/products/CategoryOfProducts');
        return res.data;
    } catch (error) {
        console.error('Axios error:', error);
        throw error;
    }
};

export const productDetailPage = async (id: string) => {
    try {
        const response = await api.get(`user/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
    }
};

export const getFilteredProducts = async (filters: any) => {
    try {
        const response = await api.post('user/products/filtered', filters);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        throw error;
    }
};

export const getYouMayLikeProducts = async (merchantId: string, subSubCategoryId: string) => {
    try {
        const res = await api.get('user/products/getYouMayLikeProducts', {
            params: {
                merchantId,
                subSubCategoryId,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Axios error in getYouMayLikeProducts:', error);
        throw error;
    }
};

export const addToWishlist = async (productId: string, variantId: string) => {
    try {
        const res = await api.post('user/wishlist/add', { productId, variantId });
        return res.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
};

export const removeFromWishlist = async (wishlistItemId: string) => {
    try {
        const res = await api.delete(`user/wishlist/delete/${wishlistItemId}`);
        return res.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
};

export const getMyWishlist = async () => {
    try {
        const res = await api.get('user/wishlist/my');
        console.log(res, '232');

        return res.data.data;
    } catch (err: any) {
        throw err.response?.data || err;
    }
};
