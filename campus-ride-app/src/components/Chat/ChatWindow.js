import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../../api'; // Assuming these functions are defined in your api/index.js

const ChatWindow = ({ rideId, userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const fetchedMessages = await getMessages(rideId);
            setMessages(fetchedMessages);
        };

        fetchMessages();
    }, [rideId]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            await sendMessage(rideId, userId, newMessage);
            setNewMessage('');
            // Optionally, fetch messages again to update the chat window
            const updatedMessages = await getMessages(rideId);
            setMessages(updatedMessages);
        }
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
                        <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;