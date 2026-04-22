import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { ConstructorState } from './constructorTypes';
import { orderBurgerApi } from '@api';
import { addOrder } from '../feed/feed';

// Начальное состояние конструктора бургера
const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error
    ? err.message
    : typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : fallback;

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientIds: string[], { dispatch, rejectWithValue }) => {
    try {
      const orderData = await orderBurgerApi(ingredientIds);
      dispatch(addOrder(orderData.order));
      return orderData.order;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка оформления заказа'));
    }
  }
);

// Слайс конструктора бургера
const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Устанавливаем выбранную булку
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    // Добавляем ингредиент в конструктор
    addIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      state.ingredients.push(action.payload);
    },
    // Удаляем ингредиент по id
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Очищаем конструктор (булка и ингредиенты)
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
    },
    // Устанавливаем статус запроса оформления заказа
    setOrderRequest(state, action: PayloadAction<boolean>) {
      state.orderRequest = action.payload;
    },
    // Устанавливаем данные модального окна заказа
    setOrderModalData(state, action: PayloadAction<TOrder | null>) {
      state.orderModalData = action.payload;
    },
    // Перемещаем ингредиент внутри конструктора
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length ||
        from === to
      ) {
        return;
      }
      const updated = [...state.ingredients];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      state.ingredients = updated;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderModalData = action.payload;
          state.bun = null;
          state.ingredients = [];
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload as string;
      });
  }
});

export const constructorReducer = constructorSlice.reducer;
export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setOrderRequest,
  setOrderModalData
} = constructorSlice.actions;
