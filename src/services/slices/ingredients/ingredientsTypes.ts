import { TIngredient } from '@utils-types';

// Тип состояния ингредиентов

export type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};
