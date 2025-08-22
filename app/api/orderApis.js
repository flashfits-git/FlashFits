import api from '../../axiosConfig';
import { getSocket } from '../config/socket';

export const createOrder = async () => {
  try {
    const res = await api.post("/user/order/create");
    const order = res.data;

    // ✅ join the socket room for this order
    const socket = getSocket();
    if (socket) {
      socket.emit("joinOrderRoom", order._id);
      console.log(`Joined order room: order_${order._id}`);
    }

    return order;
  } catch (error) {
    console.error("Axios error:", error);
    throw error;
  }
};
