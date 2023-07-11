import { configureStore } from '@reduxjs/toolkit';
import setupReducer from '../../features/setup/setupSlice';
import questionsReducer from '../../features/getData/dataSlice';

export const store = configureStore({
  reducer: {
    setup: setupReducer,
    questions: questionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
