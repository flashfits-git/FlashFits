import { io } from "socket.io-client";
import {getUserId} from "../utilities/secureStore";

// Replace with your backend server URL
const SOCKET_URL = "https://2e5ed64cf91e.ngrok-free.app"; // use your local IP for device testing

let socket;

export const initSocket = async () => {
  const userId = await getUserId("userId"); 
  const role ="user" 
  if (!socket) {
    socket = io(SOCKET_URL, {
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
