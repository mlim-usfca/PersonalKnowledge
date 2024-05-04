import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { addNewCategory, addNewLink, fetchCategories } from'@/app/archive/functions';
import { Category } from '@/app/interfaces';
import { User } from '@supabase/supabase-js';

interface CategoryState {
  categories: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    status: 'idle',
    error: null,
};

export const fetchCategoriesAsync = createAsyncThunk(
  'categories/fetchCategories',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetchCategories(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCategoryAsync = createAsyncThunk(
  'categories/addCategory',
  async ({ userId, category }: { category: string, userId: string  }, { rejectWithValue }) => {
    try {
      const error = await addNewCategory(category, userId);
      if (error) {
        return rejectWithValue(error);
      }
      return {
        id: Math.random().toString(),
        name: category,
        links: [],
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addLinkToCategory: (state, action: PayloadAction<{ link: string, user: User, category: string }>) => {
      state.categories.forEach((category) => {
        if (category.name === action.payload.category) {
          category.links.push(action.payload.link);
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(addCategoryAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategoryAsync.fulfilled, (state, action: PayloadAction<Category>) => {
        state.status = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add category';
      });
  },
});

export const { addLinkToCategory } = categorySlice.actions;
export const { } = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;
