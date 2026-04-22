import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';
import { fetchOrderByNumber } from '../../services/slices/feed/feed';
import {
  selectCurrentOrder,
  selectCurrentOrderError,
  selectCurrentOrderLoading
} from '../../services/selectors/feedSelectors';

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
  const currentOrderData = useSelector(selectCurrentOrder);
  const loading = useSelector(selectCurrentOrderLoading);
  const error = useSelector(selectCurrentOrderError);

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, ingredients.length]);

  const fetchedOrder =
    currentOrderData && String(currentOrderData.number) === number
      ? currentOrderData
      : null;

  // Загружаем заказ по номеру, если его нет в feed
  useEffect(() => {
    if (!orderData && number && !fetchedOrder) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, fetchedOrder, orderData, number]);

  // Текущий заказ: либо из feed, либо загруженный отдельно
  const currentOrder = orderData || fetchedOrder;
  const currentOrderError = currentOrder ? null : error;

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
  if (!currentOrder && loading) return <Preloader />;
  if (currentOrderError)
    return (
      <div style={{ textAlign: 'center', color: 'red', margin: '2rem' }}>
        {currentOrderError}
      </div>
    );
  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
