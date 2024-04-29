import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useAuth } from '@/app/auth/provider';
import { Category } from '@/app/interfaces';
import { Message } from '@/app/chats/types';
import { 
    addMessageToChat, 
    processMessagesAsync, 
    fetchOrCreateChat, 
    initChatState 
} from '@/app/chats/chatsSlice';
import Searchbar from '@/components/searchbar';
import Loader from '@/components/loader';
import Image from 'next/image';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

const ChatComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const { chat, messagesStatus, messagesError, status, error } = useAppSelector((state) => state.chats);
    const categories = useAppSelector((state) => state.categories.categories);
    const [messages, setMessages] = useState<Message[]>([]);
    const [category, setCategory] = useState<Category>(categories[0]);
    const [categoryName, setCategoryName] = useState('');
    const [messageText, setMessageText] = useState('');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleCategorySwitch = () => {
        setIsCategoryModalOpen(true);
        dispatch(initChatState());
    }

    const handleNewMessageText = (newMessage: string) => {
        if (messagesStatus !== 'loading') {
            sendMessage(newMessage);
        } else {
            setMessageText(newMessage);
            alert('Please wait for the previous message to be processed');
        }
    }

    const addCategoryToChat = async () => {
        if (category && user) {
            await dispatch(fetchOrCreateChat({category, user}));
            setMessages(chat.messages);
        }
        setIsCategoryModalOpen(false);
    }

    const sendMessage = async (newMessage: string) => {
        if (chat && newMessage.trim() !== '') {
            const message = {
                content: newMessage,
                role: 'user',
            };
            await dispatch(addMessageToChat({ message, chat }));
            await dispatch(processMessagesAsync({ message, chat }));
            setMessageText('');
        }
    };

    const getUserName = () => {
        if (user) {
            return user.user_metadata.full_name;
        }
        return 'Anonymous';
    }

    useEffect(() => {
        setIsCategoryModalOpen(true);
        if (category) {
            setCategoryName(category.name)
        }
    }, []);

    useEffect(() => {
        setMessages(chat.messages);
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [[chat.messages.length]]);

    useEffect(() => {
        if (user) {
            dispatch(fetchOrCreateChat({ category, user }));
        }
    }, [category, user]);

    return (
        <div className="flex flex-col h-full">
            {status === 'loading' && <Loader />}
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
            <div className="flex-grow overflow-auto overflow-y-auto">
            <>
            { messages.map((msg, index) => (
                <div key={index + Math.random()}>
                    <div className="mb-3">
                        <div className="flex">
                            <div className="h-9 w-9 flex items-center justify-center">
                            { getUserName() === 'Anonymous' || msg.role === 'system' ?
                                <Image className="rounded-full" src="/images/user.png" alt="user" width={35} height={35} />
                                :
                                <img src={user?.user_metadata.avatar_url} alt="User Avatar" width={80} height={80} className="rounded-full" />
                            }
                            </div>
                            <div className={`${ msg.role === 'system' ? 'bg-purple-200' : 'bg-blue-200' } rounded-lg ml-3 p-2 w-11/12 text-sm`}>
                                <div className='font-semibold'>
                                    { msg.role === 'system' ? 'DragonAI' : getUserName() }
                                </div>
                                <p className="my-1 text-left text-md">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                    <hr className='my-1' />
                </div>
            ))}
            {messagesStatus === 'loading' && <Loader />}
            {messagesStatus === 'failed' && <div>Error: {messagesError}</div>} 
            <div ref={chatEndRef} />
            </>
            </div>
            <button className="flex gap-3 justify-end text-gray-400 hover:text-gray-500 my-3" type="button" onClick={(e) => {
                e.preventDefault();
                handleCategorySwitch()
            }}>
                <div className='flex my-auto'>
                    <span className='text-sm'>Switch Category</span>
                    <ArrowPathIcon className="h-4 w-4 my-auto" />
                </div>
                <span className='px-2 py-1 rounded-md bg-orange-300 text-yellow-50 text-sm'>{ categoryName }</span>
            </button>
            <div className="flex-none">
                <Searchbar message={messageText} setMessage={setMessageText} sendMessage={handleNewMessageText} />
            </div>
        </div>
    );
};

export default ChatComponent;
