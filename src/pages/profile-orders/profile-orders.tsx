import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';
import { Preloader } from '@ui';
import { fetchProfileOrders } from '../../services/slices/feed/feed';
import {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '../../services/selectors/feedSelectors';

// Компонент для отображения заказов пользователя в профиле
export const ProfileOrders: FC = () => {
  const user = useSelector((state) => state.auth.user);
  const ingredients = useSelector((state) => state.ingredients.items);
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  // Загружаем ингредиенты, если их нет в сторе
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Загружаем заказы пользователя при изменении user
  useEffect(() => {
    if (!user) return;
    dispatch(fetchProfileOrders());
  }, [dispatch, user]);

  // Показываем прелоадер или ошибку, если нужно
  if (isLoading) return <Preloader />;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  // Рендерим UI заказов пользователя
  return <ProfileOrdersUI orders={orders} />;
};
