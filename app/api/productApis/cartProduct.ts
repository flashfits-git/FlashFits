import * as SecureStore from 'expo-secure-store';
import api from '../../../axiosConfig';

export const AddProducttoCart = async (productData: any) => {
    try {
        const response = await api.post('user/cart/add', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetCart = async () => {
    try {
        const response = await api.get('user/cartCount');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const getCartbyPassAdress = async (addressId: string, serviceable: boolean) => {
    try {
        const response = await api.post('user/cart', {
            addressId,
            serviceable,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const deleteCartItem = async (productId: string) => {
    try {
        const res = await api.delete(`user/cart/delete/${productId}`);
        return res.data;
    } catch (err) {
        console.error('Error deleting item from cart:', err);
        throw err;
    }
};

export const clearCart = async () => {
    const token = await SecureStore.getItemAsync('token');
    const response = await api.delete('user/cart/clear', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const UpdateCartQuantity = async ({ cartId, quantity }: { cartId: string, quantity: number }) => {
    try {
        const response = await api.put('user/cart/updatequantity', {
            cartId,
            quantity
        });
        return response.data;
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
};

export const createAddress = async (addressData: any) => {
    try {
        const response = await api.post('user/address/add', addressData);
        return response.data;
    } catch (error) {
        console.error('Error creating address:', error);
        throw error;
    }
};

export const getAddresses = async () => {
    try {
        const response = await api.get('user/address/getAllAddress');
        return response.data;
    } catch (error) {
        console.error('Error fetching addresses:', error);
        throw error;
    }
};
