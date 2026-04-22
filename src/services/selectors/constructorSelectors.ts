import { RootState } from '../store';
import { TConstructorIngredient, TIngredient } from '@utils-types';

// Селектор булки из конструктора
export const selectConstructorBun = (state: RootState): TIngredient | null =>
  state.burgerConstructor.bun;

// Селектор ингредиентов из конструктора
export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

// Селектор статуса оформления заказа
export const selectOrderRequest = (state: RootState): boolean =>
  state.burgerConstructor.orderRequest;

// Селектор данных модального окна заказа
export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

// Селектор ошибки оформления заказа
export const selectOrderError = (state: RootState): string | null =>
  state.burgerConstructor.orderError;
