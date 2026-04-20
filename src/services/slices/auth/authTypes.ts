import { TUser } from '@utils-types';

// Тип состояния для авторизации пользователя
export type AuthState = {
  user: TUser | null;
  isLoggedIn: boolean;
  isAuthChecked: boolean;
};
