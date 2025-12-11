import api from '../../axiosConfig';
// import { getSocket , initSocket } from '../config/socket';

export const createOrder = async ({addressId}) => {
  try {
    const res = await api.post("/user/order/create", { addressId });
    const order = res.data;
    console.log(order,"order");
    return order;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};

// create an api for final payment for all buy having param order id
export const finalpaymentInitiate = async (payload) => {
  try {
    const { orderId, items } = payload; 

    console.log("Final Payment Payload:", payload);

    const res = await api.post(
      `/user/order/createFinalPaymentOrder/${orderId}`,
      {
        items,
      }
    );

    console.log(res, "Final Payment Order Response");
    return res.data;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};


// create aoi fpr /order/verifyFinalPayment'

export const finalpaymetVerify = async (paymentData, internalOrderId ) => {
  try {
    const response = await api.post('user/order/verifyFinalPayment',
      {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        orderId: internalOrderId, // your pending order ID
      }
    );
    return response.data
  } catch (error) {
    console.error('Verification failed:', error.response?.data || error);
    Alert.alert('Verification Failed', 'Payment was made but verification failed. Contact support.');
  }
};


export const getAllOrders = async () =>{
  try{
    const res = await api.get("/user/order/getAllOrders");
    // console.log(res.data.orders);
    
    return res.data.orders
    
  }
  catch(error){
    console.log(error,"error")
    throw error;
  }
}

export const ConfirmClothSelection = async ( payload ) => {
  try {
    const res = await api.post(`/user/order/initiateReturn/${payload.orderId}`, payload);
    return res.data;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};

export const someSelectedOtherReturn = async ( payload ) => {
  try {
    // const res = await api.post(`/user/order/initiateReturn/${payload.order}`, payload);
    // return res.data;
    console.log(payload,"payload");
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};

// create api for get order by passing order id

export const getOrderById = async (orderId) => {
  try {
    const res = await api.get(`/user/order/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};

export const  verifyPaymentAndConfirmOrder = async ( paymentData, internalOrderId) => {
  try {
    const response = await api.post('user/order/verifyPayment',
      {
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        orderId: internalOrderId, // your pending order ID
      }
    );
    return response.data
  } catch (error) {
    console.error('Verification failed:', error.response?.data || error);
    Alert.alert('Verification Failed', 'Payment was made but verification failed. Contact support.');
  }
};