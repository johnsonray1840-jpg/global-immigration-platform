'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { getToken } from '@/lib/auth';
import { toast } from 'sonner';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const newSocket = io('http://localhost:3001', {
      auth: { token },
    });

    newSocket.on('case-created', (data) => {
      toast.success('New case created');
    });

    newSocket.on('document-uploaded', (data) => {
      toast.success('Document uploaded successfully');
    });

    newSocket.on('payment-updated', (data) => {
      toast.success(`Payment status: ${data.status}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
