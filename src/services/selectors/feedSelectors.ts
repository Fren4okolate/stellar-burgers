import { RootState } from '../store';
import { TOrder } from '@utils-types';

// Селектор заказов ленты
export const selectFeedOrders = (state: RootState): TOrder[] =>
  state.feed.orders;

// Селектор общего количества заказов
export const selectFeedTotal = (state: RootState): number => state.feed.total;

// Селектор количества заказов за сегодня
export const selectFeedTotalToday = (state: RootState): number =>
  state.feed.totalToday;

// Селектор статуса загрузки ленты
export const selectFeedIsLoading = (state: RootState): boolean =>
  state.feed.isLoading;

// Селектор ошибки ленты
export const selectFeedError = (state: RootState): string | null =>
  state.feed.error;

// Селектор заказов пользователя
export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.feed.profileOrders;

// Селектор статуса загрузки заказов пользователя
export const selectProfileOrdersLoading = (state: RootState): boolean =>
  state.feed.profileOrdersLoading;

// Селектор ошибки загрузки заказов пользователя
export const selectProfileOrdersError = (state: RootState): string | null =>
  state.feed.profileOrdersError;

// Селектор отдельно загруженного заказа
export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.feed.currentOrder;

// Селектор статуса загрузки отдельного заказа
export const selectCurrentOrderLoading = (state: RootState): boolean =>
  state.feed.currentOrderLoading;

// Селектор ошибки загрузки отдельного заказа
export const selectCurrentOrderError = (state: RootState): string | null =>
  state.feed.currentOrderError;
