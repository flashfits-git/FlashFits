import api from '../../../axiosConfig';
import * as SecureStore from 'expo-secure-store';

export const getMerchants = async () => {
    try {
        const token = await SecureStore.getItemAsync('token');
        const response = await api.get('admin/getMerchants');
        // console.log(response,'7888686');
        
        return response.data;
    } catch (error) {
        console.error('Failed to fetch merchants:', error);
        throw error;
    }
};

export const getMerchantById = async (id: string) => {
    try {
        const response = await api.get(`/admin/getMerchant/${id}`);
        console.log(response,'783r88686');

        return response.data;
    } catch (error) {
        console.error(`Failed to fetch merchant with ID ${id}:`, error);
        throw error;
    }
};

export const getProductsBatch = async (merchantIds: string[]) => {
    try {
        const response = await api.post('user/products/batch', { merchantIds });
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch :`, error);
        throw error;
    }
};

export const getProductsByMerchantId = async (merchantId: string) => {
    try {
        const response = await api.get(`user/products/merchant/${merchantId}`);
        console.log(response,'7888vd686');

        return response.data.products;
    } catch (error) {
        console.error(`Failed to fetch products for merchant ${merchantId}:`, error);
        throw error;
    }
};
