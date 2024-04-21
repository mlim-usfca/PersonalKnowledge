import { configureStore } from '@reduxjs/toolkit';
import { chatsReducer } from '@/app/chats/chatsSlice';
import { savedLinksReducer } from '@/store/savedContentSlice';
import { tagsReducer } from '@/store/tagsSlice';

export const store = configureStore({
  reducer: {
    chats: chatsReducer,
    savedLinks: savedLinksReducer,
    tags: tagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
