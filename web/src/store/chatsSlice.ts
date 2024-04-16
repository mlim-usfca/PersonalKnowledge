import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMessageResponse } from '@/app/api'; // Import your API functions
import { Chat, Message, Category } from '@/app/interfaces';

interface ChatsState {
  chat: Chat;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getInitialState = () => {
  const initialState: ChatsState = {
    chat: {
      id: '1',
      messages: [],
      category: <Category>{}
    },
    status: 'idle',
    error: null,
  };
  return initialState;
};

const initialState = getInitialState();

export const fetchMessageResponseAsync = createAsyncThunk(
  'chat/fetchMessageResponse',
  async ({ userId, message }: { userId: string, message: Message }, { rejectWithValue }) => {
    try {
      const response = await fetchMessageResponse(userId, message);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatsSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    newChat: (state, action: PayloadAction<Category>) => {
      // Resetting the state by manually setting each top-level property
      state.chat = {
        id: '1',  // You might want to generate a new ID or reset it based on your needs
        messages: [],
        category: action.payload
      };
      state.status = 'idle';
      state.error = null;
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      state.chat = {
        ...state.chat,
        category: action.payload
      }
    },
    addMessageToChat: (state, action: PayloadAction<Message>) => {
      state.chat.messages.push(action.payload);
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessageResponseAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessageResponseAsync.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = 'succeeded';
        state.chat.messages.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(fetchMessageResponseAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch chats';
      })
  },
});

export const { newChat, updateCategory, addMessageToChat } = chatsSlice.actions;
export const chatsReducer = chatsSlice.reducer;
