import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useAuth } from '@/app/auth/provider';
import Searchbar from './searchbar';
import { Category } from '@/app/interfaces';
import { newChat, updateCategory, addMessageToChat, fetchMessageResponseAsync } from '@/store/chatsSlice';
import Image from 'next/image';
import {supabase} from "@/components/supabase";
import { env, pipeline } from '@xenova/transformers';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;


const categories: Category[] = [
    { id: '1', name: 'To visit' },
    { id: '2', name: 'To eat' }
]

const ChatComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const { chat, status, error } = useAppSelector((state) => state.chats);
    const [category, setCategory] = useState<Category>(categories[0]);
    const [messageText, setMessageText] = useState('');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    // const tag = "TAG_HERE"

    interface Message {
        content: string;
    }

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [[chat.messages.length]]);

    useEffect(() => {
        if(chat.messages.length === 0) return;

        const lastMessage = chat.messages[chat.messages.length - 1];
        const txt = lastMessage.res.text;

        // parse all the messages into the Message interface and make a list
        const formatted_messages: Message[] = [];
        chat.messages.forEach((msg) => {
            // formatted_messages.push({ role: "user", content: msg.res.text });
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

            const stream = await supabase.functions.invoke('chat', {
                body: JSON.stringify({ embedding: embedding, tag: category, messages: formatted_messages })
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
    }, [chat.messages]);

    const addCategoryToChat = async () => {
        if (category && chat.category.id !== category.id) {
            await dispatch(newChat(category));
        }
        setIsCategoryModalOpen(false);
    }

    const sendMessage = async (newMessage: string) => {
        if (chat && newMessage.trim() !== '') {
            const newMsg = {
                id: `${Date.now() + Math.random()}`,
                res: {
                    text: newMessage
                },
                user: user?.email || 'Anonymous'
            };
            dispatch(addMessageToChat(newMsg));
            await dispatch(fetchMessageResponseAsync({ userId: user?.id || 'user123', message: newMsg }));
            setMessageText('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {status === 'loading' && <p>Loading...</p>}
            {status === 'failed' && <div>Error: {error}</div>}
            {isCategoryModalOpen && 
                <div className="flex items-center justify-center h-screen w-screen fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-10">
                    <div className="relative mx-auto mx-4 px-7 py-6 border w-96 shadow-lg rounded-[12px] bg-white">
                        <h3 className="text-3xl font-bold leading-6 font-medium text-gray-900 mt-5 mb-3">
                            Select Category
                        </h3>
                        <form
                            className="bg-white rounded pt-6 pb-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                addCategoryToChat();
                            }}
                        >
                            <Listbox value={category} onChange={setCategory}>
                                <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                    <span className="block truncate">{category?.name}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                    {categories.map((option) => (
                                        <Listbox.Option
                                        key={option.id}
                                        value={option}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                            }`
                                        }
                                        >
                                        {({ selected }) => (
                                            <>
                                            <span
                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {option.name}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                            </>
                                        )}
                                        </Listbox.Option>
                                    ))}
                                    </Listbox.Options>
                                </Transition>
                                </div>
                            </Listbox>
                            <button
                                className="hover:bg-indigo-700 bg-indigo-600 text-white font-semibold my-2 py-2 px-4 w-full border border-gray-300 rounded shadow"
                                type="button"
                                onClick={addCategoryToChat}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            }
            <div className="flex-grow overflow-auto">
                {chat.messages.map(msg => (
                    <div className="mb-3" key={msg.id + Math.random()}>
                        <div className="flex">
                            <Image className="rounded-full" src="/images/user.png" alt="user" width={24} height={24} />
                            <div className="ml-2 my-auto">{msg.user}</div>
                        </div>
                        <p className="my-1 text-left text-sm">{msg.res.text}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <button className="flex justify-end" type="button" onClick={(e) => {
                e.preventDefault();
                setIsCategoryModalOpen(true)
              }}>
                <ArrowPathIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
            </button>
            <div className="flex-none">
                <Searchbar message={messageText} setMessage={setMessageText} sendMessage={sendMessage} />
            </div>
        </div>
    );
};

export default ChatComponent;
