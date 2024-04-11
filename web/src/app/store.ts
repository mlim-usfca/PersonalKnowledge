import { configureStore } from '@reduxjs/toolkit';
// import { useDispatch, TypedUseSelectorHook, useSelector, useStore } from "react-redux";
import { messagesReducer } from '@/store/messagesSlice';
import { savedLinksReducer } from '@/store/savedContentSlice';
import { tagsReducer } from '@/store/tagsSlice';

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    savedLinks: savedLinksReducer,
    tags: tagsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
