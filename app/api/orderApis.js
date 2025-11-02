import api from '../../axiosConfig';
import { getSocket , initSocket } from '../config/socket';

export const createOrder = async () => {
  try {
    let deliveryCharge = 500;
    const res = await api.post("/user/order/create", { deliveryCharge });
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

export const ConfirmClothSelection = async ( orderId ) => {
  try {
    const res = await api.post(`/user/order/initiateReturn/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};
