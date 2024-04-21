import { User } from "@supabase/supabase-js"
import { Category } from '@/app/interfaces';
import { Chat, Message } from "./types"
import { supabase } from "@/components/supabase";

export const getChat = async (category: Category, user: User) => {
    const chatString = localStorage.getItem(`dai-chat-${user.id}-${category.id}`)
    if (chatString) {
        return {
            data: JSON.parse(chatString),
            error: null
        }
    }
    const chat = {
        id: category.id,
        messages: [],
        category: category,
        user: user
    }
    localStorage.setItem(`dai-chat-${user.id}-${category.id}`, JSON.stringify(chat))
    return {
        data: chat,
        error: null
    }
}

export const saveChat = async (chat: any) => {
    localStorage.setItem(`dai-chat-${chat.user.id}-${chat.category.id}`, JSON.stringify(chat))
    return {
        data: chat,
        error: null
    }
}

export const saveMessage = async (chat: Chat, message: Message) => {
    const userId = chat.user.id
    const categoryId = chat.category.id
    const chatString = localStorage.getItem(`dai-chat-${userId}-${categoryId}`)
    if (!chatString) {
        return {
            data: message,
            error: 'Chat not found'
        }
    }
    const chatData: Chat = JSON.parse(chatString)
    chatData.messages.push(message)
    localStorage.setItem(`dai-chat-${userId}-${categoryId}`, JSON.stringify(chatData))
    return {
        data: message,
        error: null
    }
}

export const deleteChats = async (user: User) => {
    const chatKeys = Object.keys(localStorage).filter(key => key.startsWith(`dai-chat-${user.id}`))
    chatKeys.forEach(key => {
        localStorage.removeItem(key)
    })
    return {
        data: null,
        error: null
    }
}

export const invokeSupabaseChat = async (reqBody: string) => {
    try {
        const { data, error } = await supabase.functions.invoke('chat', 
            { body: reqBody }
        );
        if (error) throw new Error(error.message);
        return { data };

    } catch (error) {
        console.error('Error invoking Supabase function:', error);
        return { error: error };
    }
}
