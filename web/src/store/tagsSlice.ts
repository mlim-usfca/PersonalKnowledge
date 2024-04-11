import { RootState } from '@/app/store';
import { createSelector, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTags } from '@/app/api';
import { Tags } from '@/app/interfaces';
import { mockTags } from '@/app/mockData';

interface TagsState {
  tags: Tags[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const getInitialState = () => {
  const initialState: TagsState = {
    tags: [],
    status: 'idle',
    error: null,
  };
  if (process.env.NEXT_PUBLIC_DATA_SOURCE_TYPE === 'mock') {
    return {
      ...initialState,
      tags: mockTags,
      status: 'succeeded',
    };
  }
  console.log('getInitialState', initialState);
  return initialState;
};

const initialState = getInitialState();

export const fetchTagsAsync = createAsyncThunk(
  'tags/fetchTags',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchTags();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// export const selectTagByName = createSelector(
//   (state: TagsState) => state.tags,
//   (_, name: string) => name,
//   (tags, name) => {
//     const tag = tags.find((t: Tags) => t.name === name);
//     return tag;
//   }
// );

export const selectTagByName = createSelector(
    [(state: RootState) => state.tags.tags, (_, name: string) => name],
    (tags, name) => tags.find((tag) => tag.name === name)
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTagsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTagsAsync.fulfilled, (state, action: PayloadAction<Tags[]>) => {
        state.status = 'succeeded';
        state.tags = action.payload;
      })
      .addCase(fetchTagsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tags';
      })
  },
});

export const { } = tagsSlice.actions;
export const tagsReducer = tagsSlice.reducer;