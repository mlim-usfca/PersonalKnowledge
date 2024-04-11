import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { fetchMessages, addMessage } from '@/app/api'; // Import your API functions
import { Message } from '@/app/interfaces';
import { mockMessages } from '@/app/mockData';

interface MessagesState {
  messages: Message[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getInitialState = () => {
  const initialState: MessagesState = {
    messages: [],
    status: 'idle',
    error: null,
  };
  if (process.env.NEXT_PUBLIC_DATA_SOURCE_TYPE === 'mock') {
    return {
     ...initialState,
      messages: mockMessages,
      status:'succeeded',
    };
  }
  return initialState;
};

const initialState = getInitialState();

export const fetchMessagesAsync = createAsyncThunk(
  'messages/fetchMessages',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchMessages(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMessageAsync = createAsyncThunk(
  'messages/addMessage',
  async ({ userId, message }: { userId: string, message: Message }) => {
    const response = await addMessage(userId, message);
    return response;
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessagesAsync.fulfilled, (state, action: PayloadAction<Message[]>) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessagesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch messages';
      })
      // addMessageAsync
      .addCase(addMessageAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMessageAsync.fulfilled, (state, action: PayloadAction<Message>) => {
        state.status = 'succeeded';
        state.messages = [...state.messages, action.payload];
        console.log(state.messages);
      })
      .addCase(addMessageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add message';
      });
  },
});

export const {} = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
