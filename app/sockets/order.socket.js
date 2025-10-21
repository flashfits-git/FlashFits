// src/sockets/orderSocket.js
import { getSocket, initSocket } from "../config/socket";

// Join order room after placing order
export const joinOrderRoom = async (orderId) => {
  const socket = await initSocket();
  if (!socket.connected) {
    return new Promise((resolve) => {
      socket.once("connect", () => {
        console.log("Socket connected, joining room:", orderId);
        socket.emit("joinOrderRoom", orderId);
        console.log(`📢 Joined order room: order_${orderId}`);
        resolve();
      });
      socket.connect();
    });
  }
  socket.emit("joinOrderRoom", orderId);
  console.log(`📢 Joined order room: order_${orderId}`);
};

// Listen for order updates
export const listenOrderUpdates = async (callback) => {
  const socket = await initSocket(); // Ensure socket is initialized
  socket.off("orderUpdate"); // Remove previous listeners
  console.log("Socket id is:", socket.id);
  if (socket) {
    socket.on("orderUpdate", (updateData) => {
      console.log("📦 Order update:", updateData);
      callback(updateData);
    });
  } else {
    console.error("Socket not initialized");
  }
};

// Stop listening (important to avoid duplicate listeners)
export const removeOrderListeners = () => {
  const socket = getSocket();
  if (socket) {
    socket.off("orderUpdate");
  }
};
