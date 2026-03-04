import api from '../../../axiosConfig';

export const getMerchants = async () => {
    try {
        const response = await api.get('admin/getMerchants');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch merchants:', error);
        throw error;
    }
};

export const getMerchantById = async (id: string) => {
    try {
        const response = await api.get(`/admin/getMerchant/${id}`);
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
        return response.data.products;
    } catch (error) {
        console.error(`Failed to fetch products for merchant ${merchantId}:`, error);
        throw error;
    }
};
