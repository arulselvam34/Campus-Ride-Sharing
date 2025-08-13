import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Navigation from '../components/Navigation';

const Chat = () => {
    const { state, dispatch } = useApp();
    const [selectedChat, setSelectedChat] = useState(1);
    const [newMessage, setNewMessage] = useState('');
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            dispatch({
                type: 'SEND_MESSAGE',
                payload: {
                    chatId: selectedChat,
                    message: newMessage
                }
            });
            setNewMessage('');
        }
    };

    const currentChat = state.chats.find(chat => chat.id === selectedChat);
    const currentMessages = state.messages[selectedChat] || [];

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f8fafc' }}>
            <Navigation />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', height: 'calc(100vh - 100px)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', height: '100%' }}>
                    <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ margin: '0', color: '#1e293b' }}>Messages</h2>
                        </div>
                        <div style={{ overflowY: 'auto', height: 'calc(100% - 80px)' }}>
                            {state.chats.map(chat => (
                                <div 
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
                                    style={{ 
                                        padding: '15px 20px', 
                                        borderBottom: '1px solid #f1f5f9', 
                                        cursor: 'pointer',
                                        background: selectedChat === chat.id ? '#f0fdf4' : 'transparent',
                                        borderLeft: selectedChat === chat.id ? '4px solid #22c55e' : '4px solid transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', color: 'white', fontSize: '16px', position: 'relative' }}>
                                                👤
                                                {chat.online && <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid white' }}></div>}
                                            </div>
                                            <div>
                                                <h4 style={{ margin: '0', color: '#1e293b', fontSize: '16px' }}>{chat.name}</h4>
                                                <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>{chat.lastMessage}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: '0', color: '#64748b', fontSize: '12px' }}>{chat.time}</p>
                                            {chat.unread > 0 && (
                                                <div style={{ background: '#ef4444', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginTop: '5px', marginLeft: 'auto' }}>
                                                    {chat.unread}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                        {currentChat && (
                            <>
                                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: '50px', height: '50px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', color: 'white', fontSize: '20px' }}>👤</div>
                                    <div>
                                        <h3 style={{ margin: '0', color: '#1e293b' }}>{currentChat.name}</h3>
                                        <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>{currentChat.online ? 'Online' : 'Last seen recently'}</p>
                                    </div>
                                </div>
                                
                                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {currentMessages.map(message => (
                                        <div key={message.id} style={{ display: 'flex', justifyContent: message.isMe ? 'flex-end' : 'flex-start' }}>
                                            <div style={{ 
                                                maxWidth: '70%',
                                                padding: '12px 16px',
                                                borderRadius: '18px',
                                                background: message.isMe ? '#22c55e' : '#f1f5f9',
                                                color: message.isMe ? 'white' : '#1e293b'
                                            }}>
                                                <p style={{ margin: '0', fontSize: '14px' }}>{message.message}</p>
                                                <p style={{ margin: '5px 0 0', fontSize: '12px', opacity: 0.7 }}>{message.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        style={{ flex: 1, padding: '12px 16px', borderRadius: '25px', border: '2px solid #e2e8f0', outline: 'none' }} 
                                        required
                                    />
                                    <button type="submit" style={{ padding: '12px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '600' }}>Send</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;