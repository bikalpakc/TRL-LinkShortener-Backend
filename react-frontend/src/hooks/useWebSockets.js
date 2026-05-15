import { useEffect } from 'react';

export const useWebSockets = (token, onMessage) => {
    useEffect(() => {
        if (!token) return;

        // Connect to your Django Channels server
        const socket = new WebSocket(`ws://localhost:8000/ws/analytics/?token=${token}`);

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data); // Pass the data to the component
        };

        socket.onclose = () => {
            console.log("WebSocket Disconnected.");
        };

        // Cleanup: Close the connection if the user leaves the page
        return () => socket.close();
    }, [token, onMessage]);
};