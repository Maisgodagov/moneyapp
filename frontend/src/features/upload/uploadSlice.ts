import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import axios from 'axios';
import type { ParsedTransaction } from '../../types/transaction';

interface UploadState {
  uploading: boolean;
  error: string | null;
  success: boolean;
  parsedTransactions: ParsedTransaction[];
  statementId: string | null;
  saving: boolean;
  saveSuccess: boolean;
}

const initialState: UploadState = {
  uploading: false,
  error: null,
  success: false,
  parsedTransactions: [],
  statementId: null,
  saving: false,
  saveSuccess: false,
};

export const uploadPDF = createAsyncThunk(
  'upload/uploadPDF',
  async (file: File, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    try {
      const { data } = await api.post('/upload/parse', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to upload PDF');
    }
  }
);

export const saveStatement = createAsyncThunk(
  'upload/saveStatement',
  async ({ filename, transactions }: { filename: string; transactions: ParsedTransaction[] }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/transactions/statements', { filename, transactions });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Failed to save statement');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.error = null;
      state.success = false;
      state.parsedTransactions = [];
      state.statementId = null;
      state.saving = false;
      state.saveSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPDF.pending, (state) => {
        state.uploading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadPDF.fulfilled, (state, action) => {
        state.uploading = false;
        state.success = true;
        state.parsedTransactions = action.payload.transactions || [];
      })
      .addCase(uploadPDF.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.error.message || 'Failed to upload PDF';
        state.success = false;
      })
      .addCase(saveStatement.pending, (state) => {
        state.saving = true;
        state.saveSuccess = false;
        state.error = null;
      })
      .addCase(saveStatement.fulfilled, (state, action) => {
        state.saving = false;
        state.saveSuccess = true;
        state.statementId = action.payload.statementId;
      })
      .addCase(saveStatement.rejected, (state, action) => {
        state.saving = false;
        state.saveSuccess = false;
        state.error = action.error.message || 'Failed to save statement';
      });
  },
});

export const { clearUploadState } = uploadSlice.actions;
export default uploadSlice.reducer; 