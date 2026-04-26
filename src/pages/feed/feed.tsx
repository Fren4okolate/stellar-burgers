import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feed/feed';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';
import { useLocation } from 'react-router-dom';

// Компонент ленты заказов
export const Feed: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { orders, isLoading } = useSelector((state) => state.feed);
  const { items: ingredients, isLoading: isIngredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  // Загружаем ленту заказов только при монтировании
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Показываем прелоадер, если идёт загрузка заказов или ингредиентов
  if (isLoading || isIngredientsLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
