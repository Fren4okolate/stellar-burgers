import { FC } from 'react';
import { useSelector } from '../../services/store';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Вспомогательная функция для получения номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

// Компонент информации о ленте заказов
export const FeedInfo: FC = () => {
  const { orders } = useSelector((state) => state.feed);
  const feed = useSelector((state) => state.feed);

  // Массивы номеров заказов по статусу
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
