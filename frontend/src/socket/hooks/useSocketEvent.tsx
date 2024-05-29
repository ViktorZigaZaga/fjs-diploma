import { useEffect } from 'react';
import { socket } from '../SocketClient';

export const useSocketEvent = (event: string, listener: (...args: any[]) => void) => {
    useEffect(() => {
        socket.on(event, listener);
        return () => {
            socket.off(event, listener);
        };
    });
};