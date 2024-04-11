import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import Searchbar from './searchbar';
import { fetchMessagesAsync, addMessageAsync } from '@/store/messagesSlice';
import Image from 'next/image';
import {supabase} from "@/components/supabase.tsx";
import { env, pipeline } from '@xenova/transformers';

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const Chat: React.FC = () => {
    const dispatch = useAppDispatch();
    const { messages, status, error } = useAppSelector((state) => state.messages);
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const tag = "TAG_HERE"

    interface Message {
        content: string;
    }

    // useEffect(() => {
    //     dispatch(fetchMessagesAsync('user123'));
    // }, [dispatch]);

    useEffect(() => {

        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        if(messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        const txt = lastMessage.res.text;

        // parse all the messages into the Message interface and make a list
        const formatted_messages: Message[] = [];
        messages.forEach((msg) => {
            formatted_messages.push({ role: "user", content: msg.res.text });
        });

        const edge = async () => {

                const generateEmbedding = await pipeline(
                    'feature-extraction',
                    'Supabase/gte-small'
                );

                const output = await generateEmbedding(txt, {
                    pooling: 'mean',
                    normalize: true,
                });

                const embedding = JSON.stringify(Array.from(output.data));

                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    return;
                }

            const stream = await supabase.functions.invoke('chat', {
                body: JSON.stringify({ embedding: embedding, tag: tag, messages: formatted_messages })
            });


            const reader = stream.data;
            if (!reader) {
                console.error('No reader');
                return;
            }
            
            console.log("reader",reader);
            sendMessage(reader.toString());

        }

        edge();
    }, [messages]);

    const sendMessage = (newMessage: string) => {
        if (newMessage.trim() !== '') {
            const newMsg = {
                id: `${Date.now()}`,
                res: {
                    text: newMessage
                },
                user: 'Joe'
            };
            dispatch(addMessageAsync({ userId: 'user123', message: newMsg }));
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <div>Error: {error}</div>}
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
