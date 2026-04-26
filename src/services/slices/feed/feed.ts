import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { FeedState } from './feedTypes';

// Начальное состояние ленты заказов
const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  profileOrders: [],
  profileOrdersLoading: false,
  profileOrdersError: null,
  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null
};

const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error
    ? err.message
    : typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : fallback;

//Загрузка ленты заказов
export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка загрузки ленты'));
    }
  }
);

// Загрузка заказов пользователя
export const fetchProfileOrders = createAsyncThunk(
  'feed/fetchProfileOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getOrdersApi();
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка загрузки заказов'));
    }
  }
);

// Загрузка заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'feed/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      if (data.orders && data.orders.length > 0) {
        return data.orders[0];
      }
      return rejectWithValue('Заказ не найден');
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка загрузки заказа'));
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
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.profileOrdersLoading = true;
        state.profileOrdersError = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.profileOrdersLoading = false;
          state.profileOrders = action.payload;
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrdersError = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
        state.currentOrder = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.currentOrderLoading = false;
          state.currentOrder = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrderError = action.payload as string;
      });
  }
});

export const { addOrder } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
