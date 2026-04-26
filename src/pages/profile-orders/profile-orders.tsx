import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';
import { Preloader } from '@ui';

// Компонент для отображения заказов пользователя в профиле
export const ProfileOrders: FC = () => {
  const user = useSelector((state) => state.auth.user);
  const ingredients = useSelector((state) => state.ingredients.items);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем ингредиенты, если их нет в сторе
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length]);

  // Загружаем заказы пользователя при изменении user
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    getOrdersApi()
      .then((data) => {
        setOrders(data);
      })
      .catch((e) => setError(e?.message || 'Ошибка загрузки заказов'))
      .finally(() => setIsLoading(false));
  }, [user]);

  // Показываем прелоадер или ошибку, если нужно
  if (isLoading) return <Preloader />;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

  // Рендерим UI заказов пользователя
  return <ProfileOrdersUI orders={orders} />;
};
