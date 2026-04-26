import { TOrder } from '@utils-types';

// Тип состояния ленты заказов
export type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  profileOrders: TOrder[];
  profileOrdersLoading: boolean;
  profileOrdersError: string | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
};
