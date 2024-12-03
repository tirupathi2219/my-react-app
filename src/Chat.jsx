import React, { useState, useEffect } from 'react';


const ChatApp = () => {

    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState('');
    const [chats, setChats] = useState([]);
    const [user, setUser] = useState('User');

    useEffect(() => {
        // Connect to WebSocket server
        const ws = new WebSocket('ws://localhost:5000');
        setSocket(ws);

        // Fetch initial chat history
        fetch('http://localhost:5000/api/chats/getChats')
            .then((res) => res.json())
            .then((data) => {
                setChats(data);
            });

        // Listen for incoming WebSocket messages
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(JSON.parse(event.data), "26:::")
            setChats((prevChats) => [...prevChats, message]);
        };

        // Cleanup when component unmounts
        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket && socket.readyState === WebSocket.OPEN) {
            // Send the message to the WebSocket server
            socket.send(JSON.stringify({ user, chat }));
            console.log("chat submit....")
            setChat('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                {chats.map((msg, index) => (
                    <div key={index} className={msg.user === user ? 'align-right' : 'align-left'}>
                        <strong>{msg.user}</strong>: {msg.chat}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatApp;
