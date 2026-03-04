import { getSocket, initSocket } from "../config/socket";

let activeOrders: string[] = [];

export const joinOrderRoom = async (orderId: string) => {
    const socket = await initSocket();
    console.log("Socket id is:", socket.id);

    if (!socket.connected) {
        console.log("Socket not connected, connecting...");
        return new Promise<void>((resolve) => {
            socket.once("connect", () => {
                console.log("Socket connected, joining room:", orderId);
                if (!activeOrders.includes(orderId)) activeOrders.push(orderId);
                socket.emit("joinOrderRoom", orderId);
                resolve();
            });
            socket.connect();
        });
    }

    if (!activeOrders.includes(orderId)) activeOrders.push(orderId);
    socket.emit("joinOrderRoom", orderId);
    console.log(`📢 Joined order room:${orderId}`);
};

export const listenOrderUpdates = async (callback: (data: any) => void) => {
    const socket = await initSocket();
    socket.off("orderUpdate");
    socket.off('trialPhaseStart');

    if (socket) {
        socket.on("orderUpdate", (updateData) => {
            console.log("📦 Order update:", updateData);
            callback(updateData);
        });
    } else {
        console.error("Socket not initialized");
    }
};

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
