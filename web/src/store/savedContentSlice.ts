import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchSavedLinks, addSavedLink } from '@/app/api';
import { SavedLink } from '@/app/interfaces';
import { mockLinks } from '@/app/mockData';

interface SavedLinksState {
  savedLinks: SavedLink[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getInitialState = () => {
  const initialState: SavedLinksState = {
    savedLinks: [],
    status: 'idle',
    error: null,
  };
  if (process.env.NEXT_PUBLIC_DATA_SOURCE_TYPE ==='mock') {
    return {
      ...initialState,
      savedLinks: mockLinks,
      status:'succeeded',
    };
  }
return initialState;
};

const initialState = getInitialState();

export const fetchSavedLinksAsync = createAsyncThunk(
  'savedLinks/fetchSavedLinks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchSavedLinks(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSavedLinkAsync = createAsyncThunk(
  'savedLinks/addSavedLink',
  async ({userId, savedLink}: {userId: string, savedLink: SavedLink}, {rejectWithValue}) => {
    try {
      const response = await addSavedLink(userId, savedLink);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const savedLinksSlice = createSlice({
  name: 'savedLinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedLinksAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSavedLinksAsync.fulfilled, (state, action: PayloadAction<SavedLink[]>) => {
        state.status = 'succeeded';
        state.savedLinks = action.payload;
      })
      .addCase(fetchSavedLinksAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addSavedLinkAsync.fulfilled, (state, action: PayloadAction<SavedLink>) => {
        state.savedLinks.push(action.payload);
      })
      .addCase(addSavedLinkAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { } = savedLinksSlice.actions;
export const savedLinksReducer = savedLinksSlice.reducer;
