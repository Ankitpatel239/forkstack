
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export const emitNewOrder = (vendorId: string, order: any) => {
  if (global.io) {
    global.io.to(`vendor-${vendorId}`).emit("new-order", order);
    console.log(`Order emitted to vendor-${vendorId}`);
  } else {
    console.warn("Socket.io not initialized");
  }
};
