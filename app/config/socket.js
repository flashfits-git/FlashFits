import { io } from "socket.io-client";
import { getUserId } from "../utilities/secureStore";
import Constants from "expo-constants";


const { BACKEND_URL } = Constants.expoConfig.extra;

// Replace with your backend server URL
// const SOCKET_URL = "https://9e4e22431479.ngrok-free.app"; // use your local IP for device testing

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
  }
  return socket;
};

export const getSocket = () => socket;
