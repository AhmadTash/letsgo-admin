import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/api-slice';
// Import API endpoints to register them
import './api/auth-api';
import './api/students-api';
import './api/trainers-api';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

