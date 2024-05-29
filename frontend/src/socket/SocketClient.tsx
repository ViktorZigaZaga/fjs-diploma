import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { onConnectSocket, onDisconnectSocket } from '../features/socketSlice';
import { useAppDispatch } from '../store/hooks';

export const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  autoConnect: false,
});

export const SocketClient = () => {
    const dispatch = useAppDispatch()


  useEffect(() => {
    function onConnect() {
      dispatch(onConnectSocket());
    }

    function onDisconnect() {
      dispatch(onDisconnectSocket());
    }
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
  
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
};