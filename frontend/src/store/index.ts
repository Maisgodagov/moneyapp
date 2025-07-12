import { configureStore } from '@reduxjs/toolkit';
import transactionsReducer from '../features/transactions/transactionsSlice';
import uploadReducer from '../features/upload/uploadSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    upload: uploadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
