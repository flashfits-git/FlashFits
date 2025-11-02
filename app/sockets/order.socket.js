// src/sockets/orderSocket.js
import { getSocket, initSocket } from "../config/socket";
let activeOrders=[]
// Join order room after placing order
export const joinOrderRoom = async (orderId) => {
  const socket = await initSocket();
  console.log("Socket id is:", socket.id);  
  if (!socket.connected) {
    console.log("Socket not connected, connecting...");
    return new Promise((resolve) => {
      socket.once("connect", () => {
        console.log("Socket connected, joining room:", orderId);
        if (!activeOrders.includes(orderId)) activeOrders.push(orderId);
        socket.emit("joinOrderRoom", orderId);
        console.log(`📢 Joined order room: ${orderId}`);
        resolve();
      });
      socket.connect();
    });
  }
  if (!activeOrders.includes(orderId)) activeOrders.push(orderId);
  socket.emit("joinOrderRoom", orderId);
  console.log(`📢 Joined order room:${orderId}`);
};

// Listen for order updates
export const listenOrderUpdates = async (callback) => {
  const socket = await initSocket(); // Ensure socket is initialized
  socket.off("orderUpdate"); // Remove previous listeners
  socket.off('trialPhaseStart');
  console.log("Socket id is:", socket.id);
  if (socket) {
    socket.on("orderUpdate", (updateData) => {
      console.log("📦 Order update:", updateData);
      callback(updateData);
    });
    socket.on('trialPhaseStart', (data) => {
  console.log('Received trialPhaseStart:', data);
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

export const setupRejoinOnReconnect = async () => {
  const socket = await initSocket();
  socket.on("reconnect", () => {
    console.log("🔄 Reconnected! Rejoining all rooms...");
    activeOrders.forEach((orderId) => {
      socket.emit("joinOrderRoom", orderId);
    });
  });
};
