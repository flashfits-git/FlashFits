import { Alert } from 'react-native';
import api from '../../axiosConfig';

export const createOrder = async ({ addressId }: { addressId: string }) => {
    try {
        const res = await api.post("/user/order/create", { addressId });
        return res.data;
    } catch (error) {
        console.error("Axios error:", error);
        throw error;
    }
};

export const finalpaymentInitiate = async (payload: any) => {
    try {
        const { orderId, items } = payload;
        const res = await api.post(
            `/user/order/createFinalPaymentOrder/${orderId}`,
            { items }
        );
        return res.data;
    } catch (error) {
        console.error("Axios error:", error);
        throw error;
    }
};

export const finalpaymetVerify = async (paymentData: any, internalOrderId: string) => {
    try {
        const response = await api.post('user/order/verifyFinalPayment',
            {
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature,
                orderId: internalOrderId,
            }
        );
        return response.data
    } catch (error) {
        console.error('Verification failed:', error.response?.data || error);
        Alert.alert('Verification Failed', 'Payment was made but verification failed. Contact support.');
    }
};

export const getAllOrders = async () => {
    try {
        const res = await api.get("/user/order/getAllOrders");
        return res.data.orders;
    }
    catch (error) {
        console.log(error, "error")
        throw error;
    }
}

export const ConfirmClothSelection = async (payload: any) => {
    try {
        const res = await api.post(`/user/order/initiateReturn/${payload.orderId}`, payload);
        return res.data;
    } catch (error) {
        console.error("Axios error:", error);
        throw error;
    }
};

export const someSelectedOtherReturn = async (payload: any) => {
    try {
        console.log(payload, "payload");
    } catch (error) {
        console.error("Axios error:", error);
        throw error;
    }
};

export const getOrderById = async (orderId: string) => {
    try {
        const res = await api.get(`/user/order/${orderId}`);
        return res.data;
    } catch (error) {
        console.error("Axios error:", error);
        throw error;
    }
};

export const verifyPaymentAndConfirmOrder = async (paymentData: any, internalOrderId: string) => {
    try {
        const response = await api.post('user/order/verifyPayment',
            {
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature,
                orderId: internalOrderId,
            }
        );
        return response.data
    } catch (error) {
        console.error('Verification failed:', error.response?.data || error);
        Alert.alert('Verification Failed', 'Payment was made but verification failed. Contact support.');
    }
};
