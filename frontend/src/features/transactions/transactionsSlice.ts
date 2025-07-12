import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import axios from 'axios';

export interface Transaction {
  id?: number;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  bank?: string;
  account?: string;
}

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  total: number;
  stats: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    periodTransactionCount: number;
    topCategories: Array<{ category: string; amount: number }>;
  } | null;
  statsLoading: boolean;
  statsError: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  total: 0,
  stats: null,
  statsLoading: false,
  statsError: null,
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: { 
    page?: number; 
    limit?: number; 
    category?: string; 
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions', { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch transactions');
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transaction: Omit<Transaction, 'id'>, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/transactions', transaction);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to create transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction: Transaction, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/transactions/${transaction.id}`, transaction);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/transactions/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to delete transaction');
    }
  }
);

export const fetchStats = createAsyncThunk(
  'transactions/fetchStats',
  async (params: { dateFrom?: string; dateTo?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/transactions/stats/summary', { params });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to fetch stats');
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.total = action.payload.total;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
        state.total -= 1;
      })
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message || 'Failed to fetch stats';
      });
  },
});

export const { clearError } = transactionsSlice.actions;
export default transactionsSlice.reducer; 