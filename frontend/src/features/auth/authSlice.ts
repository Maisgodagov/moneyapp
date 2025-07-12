import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../api';
import type { UserCredentials, AuthResponse, AuthError } from '../../types/auth';

interface AuthState {
  user: { id: number; email: string } | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  status: 'idle',
  error: null,
};

// Async thunks
export const register = createAsyncThunk<AuthResponse, UserCredentials, { rejectValue: AuthError }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as AuthError);
      }
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
);

export const login = createAsyncThunk<AuthResponse, UserCredentials, { rejectValue: AuthError }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as AuthError);
      }
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = { id: action.payload.userId, email: action.payload.email };
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = { id: action.payload.userId, email: action.payload.email };
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 