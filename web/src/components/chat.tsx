import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from "@/app/store";
import Searchbar from './searchbar';
import { fetchMessagesAsync, addMessageAsync } from '@/store/messagesSlice';
import Image from 'next/image';

const Chat: React.FC = () => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state) => state.messages.messages || []);
    const status = useAppSelector((state) => state.messages.status);
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchMessagesAsync('user123'));
    }, [dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (newMessage: string) => {
        if (newMessage.trim() !== '') {
            const message = {
                id: `${Date.now()}`,
                res: {
                    text: newMessage
                },
                user: 'John'
            };
            dispatch(addMessageAsync({ userId: 'user123', message: message }));
            setMessage('');
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            {status === 'loading' && <p>Loading...</p>}
            <div className="flex-grow overflow-auto">
                {messages.map(msg => (
                    <div className="mb-3" key={msg.id}>
                        <div className="flex">
                            <Image className="rounded-full" src="/images/user.png" alt="user" width={24} height={24} />
                            <div className="ml-2 my-auto">{msg.user}</div>
                        </div>
                        <p className="my-1 text-left text-sm">{msg.res.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <div className="flex-none">
                <Searchbar message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
};

export default Chat;