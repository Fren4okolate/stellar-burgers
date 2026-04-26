import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructor/constructor';
import { BurgerConstructorElementProps } from './type';

// Компонент одного ингредиента в конструкторе бургера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Обработчик перемещения ингредиента вниз
    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ from: index, to: index + 1 }));
      }
    };

    // Обработчик перемещения ингредиента вверх
    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ from: index, to: index - 1 }));
      }
    };

    // Обработчик удаления ингредиента
    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
