import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { AuthState } from './authTypes';

// Начальное состояние авторизации
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isAuthChecked: false
};

// Слайс авторизации пользователя
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Устанавливаем пользователя и статус авторизации
    setUser(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAuthChecked = true;
    },
    // Очищаем пользователя и сбрасываем статус авторизации
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.isAuthChecked = true;
    },
    // Устанавливам статус проверки авторизации
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  }
});

export const { setUser, logout, setAuthChecked } = authSlice.actions;
export const authReducer = authSlice.reducer;
