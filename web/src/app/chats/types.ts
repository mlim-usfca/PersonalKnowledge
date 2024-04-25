import { User } from "@supabase/supabase-js";
import { Category } from '@/app/interfaces';

export interface Message {
    role: string;
    content: string;
}
  
export interface Chat {
    id: string;
    messages: Message[];
    category: Category;
    user: User;
}
  
export interface ChatState {
    chat: Chat;
    messagesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    messagesError: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
