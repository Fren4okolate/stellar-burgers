import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import {
  setBun,
  addIngredient
} from '../../services/slices/constructor/constructor';
import { TBurgerIngredientProps } from './type';

// Компонент одного ингредиента для списка ингредиентов
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    // Обработчик добавления ингредиента в конструктор
    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        dispatch(addIngredient({ ...ingredient, id: crypto.randomUUID() }));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
