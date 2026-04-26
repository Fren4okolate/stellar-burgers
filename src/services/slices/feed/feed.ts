import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { FeedState } from './feedTypes';

// Начальное состояние ленты заказов
const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

//Загрузка ленты заказов
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка загрузки ленты');
    }
  }
);

// Слайс ленты заказов
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // Добавляем заказ в начало ленты
    addOrder(state, action: PayloadAction<TOrder>) {
      state.orders.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addOrder } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
