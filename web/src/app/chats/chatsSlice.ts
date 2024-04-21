import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '@/app/interfaces';
import { Chat, Message, ChatState } from '@/app/chats/types';
import { getChat, saveChat, saveMessage, invokeSupabaseChat } from '@/app/chats/functions';
import { User } from '@supabase/supabase-js';
import { env, pipeline } from '@xenova/transformers';

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const initialState: ChatState = {
  chat: {
    id: '',
    messages: [],
    category: <Category>{},
    user: <User>{}
  },
  messagesStatus: 'idle',
  messagesError: '' || null,
  status: 'idle',
  error: '' || null,
};

// Async thunk to load chats from database
// Fetch or create a chat based on category and user
export const fetchOrCreateChat = createAsyncThunk(
  'chats/fetchOrCreateChat',
  async ({ category, user }: { category: Category, user: User }, { rejectWithValue }) => {
    try {
        const response = await getChat(category, user);
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to fetch or create chat');
    }
  }
);

// Save chat changes to local storage
export const updateChat = createAsyncThunk(
  'chats/updateChat',
  async (chat: Chat, { rejectWithValue }) => {
      try {
          const response = await saveChat(chat);
          return response.data;
      } catch (error) {
          return rejectWithValue('Failed to save chat');
      }
  }
);

export const addMessageToChat = createAsyncThunk(
  'chats/addMessageToChat',
  async (
    { message, chat }: { message: Message, chat: Chat }, 
    { rejectWithValue }
  ) => {
      try {
          const response = await saveMessage(chat, message);
          return response.data;
      } catch (error) {
          return rejectWithValue('Failed to save message');
      }
  }
);

// Thunk for processing messages and updating via Supabase
export const processMessagesAsync = createAsyncThunk(
  'chat/processMessages',
  async (
    { message, chat }: { message: Message, chat: Chat }, 
    { rejectWithValue }
  ) => {
    try {
      const generateEmbedding = await pipeline(
        'feature-extraction',
        'Supabase/gte-small'
      );

      const output = await generateEmbedding(message.content, {
        pooling: 'mean',
        normalize: true,
      });

      const embedding = JSON.stringify(Array.from(output.data));

      const messages = [
        ...chat.messages,
        message
      ];

      const reqBody = JSON.stringify({
        embedding: embedding,
        category: chat.category.id,
        messages: messages
      });

      let data = <Message>{
        content: 'Sorry, there was an error processing your message. Please try again.',
        role: 'system',
      }

      const stream = await invokeSupabaseChat(reqBody);
      if (!stream) {
        console.error('No stream returned from Supabase function');
      } else if (stream.error) {
        console.error('Error invoking Supabase function:', stream.error);
      } else {
        console.log("stream", stream);
        data = {
          content: stream.data.toString(),
          role: 'system'
        };
      }
      await saveMessage(chat, data);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    initChatState: (state) => {
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchOrCreateChat
      .addCase(fetchOrCreateChat.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrCreateChat.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chat = action.payload;
      })
      .addCase(fetchOrCreateChat.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // addMessageToChat
      .addCase(addMessageToChat.pending, (state) => {
        state.messagesStatus = 'loading';
      })
      .addCase(addMessageToChat.fulfilled, (state, action) => {
        state.messagesStatus = 'succeeded';
        state.chat.messages.push(action.payload);
      })
      .addCase(addMessageToChat.rejected, (state, action) => {
        state.messagesStatus = 'failed';
        state.error = action.payload as string;
      })
      // processMessagesAsync
      .addCase(processMessagesAsync.pending, (state) => {
        state.messagesStatus = 'loading';
      })
      .addCase(processMessagesAsync.fulfilled, (state, action) => {
        state.chat.messages.push(action.payload);
        state.messagesStatus = 'succeeded';
      })
      .addCase(processMessagesAsync.rejected, (state, action) => {
        state.messagesStatus = 'failed';
        state.messagesError = action.error.message || 'Failed to process message';
        const message = <Message>{
          role: 'system',
          content: 'Sorry, I am not able to process your message'
        };
        state.chat.messages.push(message);
      });
  }
});

export const { initChatState } = chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;