import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '@api';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';

// Компонент информации о заказе
export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderData = useSelector((state) =>
    state.feed.orders.find((order) => String(order.number) === number)
  );
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.items
  );
  const dispatch = useDispatch();

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length]);

  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем заказ по номеру, если его нет в feed
  useEffect(() => {
    if (!orderData && number) {
      setLoading(true);
      setError(null);
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.orders && res.orders.length > 0) {
            setFetchedOrder(res.orders[0]);
          } else {
            setError('Заказ не найден');
          }
        })
        .catch(() => setError('Ошибка загрузки заказа'))
        .finally(() => setLoading(false));
    }
  }, [orderData, number]);

  // Текущий заказ: либо из feed, либо загруженный отдельно
  const currentOrder = orderData || fetchedOrder;

  // Считаем информацию о заказе: ингредиенты с количеством, дату, стоимость
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredients.length) return null;

    const date = new Date(currentOrder.createdAt);

    // Тип для ингредиентов с количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Считаем, сколько каждого ингредиента в заказе
    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    // Считаем итоговую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredients]);

  // Показываем прелоадер или ошибку, если нужно
  if (loading) return <Preloader />;
  if (error)
    return (
      <div style={{ textAlign: 'center', color: 'red', margin: '2rem' }}>
        {error}
      </div>
    );
  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
