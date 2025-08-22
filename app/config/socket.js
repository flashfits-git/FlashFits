import { io } from "socket.io-client";

// Replace with your backend server URL
const SOCKET_URL = "http://192.168.29.230:5000"; // use your local IP for device testing

let socket;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: { userId }, // optional: identify user
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;
