
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

declare global {
  var io: any;
}

export const emitNewOrder = (vendorId: string, order: any) => {
  if (global.io) {
    global.io.to(`vendor-${vendorId}`).emit("new-order", order);
    console.log(`Order emitted to vendor-${vendorId}`);
  } else {
    console.warn("Socket.io not initialized");
  }
};

export const emitOrderUpdate = (vendorId: string, order: any) => {
  if (global.io) {
    global.io.to(`vendor-${vendorId}`).emit("order-update", order);
    console.log(`Order update emitted to vendor-${vendorId}`);
  } else {
    console.warn("Socket.io not initialized");
  }
};
