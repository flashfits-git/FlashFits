import { io } from "socket.io-client";
import { getUserId } from "../utilities/secureStore";
import Constants from "expo-constants";
const { BACKEND_URL } = Constants.expoConfig.extra;
// Replace with your backend server URL
const SOCKET_URL = `${BACKEND_URL}`; // use your local IP for device testing

let socket;

export const initSocket = async () => {
  const userId = await getUserId("userId"); 
  const role ="user" 
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ["websocket"],
      query: { userId: userId,role:role }, // optional: identify user
    });
 
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      // Optional: Implement retry logic with exponential backoff
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};

export const getSocket = () => socket;
