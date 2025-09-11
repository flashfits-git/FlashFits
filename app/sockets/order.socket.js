// src/sockets/orderSocket.js
import { getSocket, initSocket } from "../config/socket";

// Join order room after placing order
export const joinOrderRoom = async (orderId) => {
  const socket = await initSocket();
  console.log("Socket id is:", socket.id);
  if (socket && socket.connected) {
    socket.emit("joinOrderRoom", orderId);
    console.log(`📢 Joined order room: order_${orderId}`);
  }
};

// Listen for order updates
export const listenOrderUpdates = (callback) => {
  const socket = getSocket();
  console.log("Socket id is:", socket.id);
  if (socket) {
    socket.on("orderUpdate", (updateData) => {
      console.log("📦 Order update:", updateData);
      callback(updateData); // pass to component
    });
  }
  else{
    console.log("Socket not connected");
  }
};

// Stop listening (important to avoid duplicate listeners)
export const removeOrderListeners = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("orderUpdate");
  }
};
