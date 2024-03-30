import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMessages, addMessage } from '@/app/api'; // Import your API functions
import { Message } from '@/app/interfaces';

interface MessagesState {
  messages: Message[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  status: 'idle',
  error: null,
};

export const fetchMessagesAsync = createAsyncThunk(
  'messages/fetchMessages',
  async (userId: string) => {
    const response = await fetchMessages(userId);
    return response;
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
        state.messages.push(action.payload);
      })
      .addCase(addMessageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add message';
      });
  },
});

export const {} = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
