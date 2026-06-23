// redux/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to create payment via backend API
export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async ({ amount, currency, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Payment creation failed');
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    loading: false,
    error: null,
    paymentUrl: null,
    transactionId: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentUrl = null;
      state.transactionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.paymentUrl;
        state.transactionId = action.payload.transactionId;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create payment';
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
