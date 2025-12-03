import api from '../../axiosConfig';
import { getSocket , initSocket } from '../config/socket';

export const createOrder = async ({addressId}) => {
  try {
    let deliveryCharge = 500;
    const res = await api.post("/user/order/create", { addressId });
    const order = res.data;
    // initSocket();
    // // ✅ join the socket room for this order
    // const socket = getSocket();
    // if (socket) {
    //   socket.emit("joinOrderRoom", order._id);
    //   console.log(`Joined order room: order_${order._id}`);
    // }
    console.log(order,"order");
    return order;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
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