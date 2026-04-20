import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';

// Компонент деталей ингредиента
export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const items = useSelector((state) => state.ingredients.items);
  const dispatch = useDispatch();

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!items.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, items.length]);

  // Находим ингредиент по id
  const ingredientData = items.find((item) => item._id === id);

  // Если ингредиент не найден — показываем прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
