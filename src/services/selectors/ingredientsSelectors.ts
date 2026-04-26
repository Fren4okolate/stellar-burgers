import { RootState } from '../store';
import { TIngredient } from '@utils-types';

// Селектор ингредиентов
export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;

// Селектор статуса загрузки ингредиентов
export const selectIngredientsIsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

// Селектор ошибки загрузки ингредиентов
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;
