import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { ConstructorState } from './constructorTypes';

// Начальное состояние конструктора бургера
const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

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
