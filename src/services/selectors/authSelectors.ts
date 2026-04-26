import { RootState } from '../store';
import { TUser } from '@utils-types';

// Селектор пользователя
export const selectUser = (state: RootState): TUser | null => state.auth.user;

// Селектор статуса авторизации

export const selectIsLoggedIn = (state: RootState): boolean =>
  state.auth.isLoggedIn;

// Селектор статуса проверки авторизации
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.auth.isAuthChecked;
