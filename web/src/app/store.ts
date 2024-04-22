import { configureStore } from '@reduxjs/toolkit';
import { chatsReducer } from '@/app/chats/chatsSlice';
import { savedLinksReducer } from '@/store/savedContentSlice';
import { categoryReducer } from '@/app/archive/categorySlice';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    savedLinks: savedLinksReducer,
    categories: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
