
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(vendorId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!vendorId) return;

    const socketInstance = io({
      path: '/socket.io',
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server');
      socketInstance.emit('join-vendor', vendorId);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [vendorId]);

  return socket;
}
  