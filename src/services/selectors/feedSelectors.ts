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
