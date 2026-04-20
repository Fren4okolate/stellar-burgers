// Типы для конструктора бургера
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

// Тип состояния для конструктора бургера
export type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};
