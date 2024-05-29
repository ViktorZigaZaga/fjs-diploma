import { useEffect } from 'react';
import { socket } from '../SocketClient';
import { useSelector } from 'react-redux';
import { selectUserRoleId } from '../../features/authSlice';

export const useSocket = () => {
    const userRoleId = useSelector(selectUserRoleId);
    useEffect(() => {
        const token = localStorage.getItem('access_token') || '' as string;
        if(userRoleId.role === "client" || userRoleId.role === "manager")
        socket.io.opts.extraHeaders = {
            Authorization: token,
        };
        socket.connect();

        const listener = (event: StorageEvent) => {
        if (event.key === 'token' && (userRoleId.role === "client" || userRoleId.role === "manager")) {
            socket.io.opts.extraHeaders = {
                Authorization: event.newValue!,
            };
        }
        };

        window.addEventListener('storage', listener);
        
        return () => { 
            socket.disconnect(); 
            window.removeEventListener('storage', listener);
        };
    }, []);
};