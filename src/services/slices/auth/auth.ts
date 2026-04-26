import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { AuthState } from './authTypes';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../../utils/cookie';

// Начальное состояние авторизации
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error
    ? err.message
    : typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : fallback;

const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

export const checkUserAuth = createAsyncThunk(
  'auth/checkUserAuth',
  async (_, { rejectWithValue }) => {
    const token =
      getCookie('accessToken') || localStorage.getItem('accessToken');

    if (!token) {
      return null;
    }

    try {
      const data = await getUserApi();
      return data.user;
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, 'Ошибка проверки авторизации')
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      saveTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка авторизации'));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      saveTokens(response.accessToken, response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка регистрации'));
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      return response.user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка обновления профиля'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка выхода из аккаунта'));
    } finally {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(data);
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, 'Ошибка восстановления пароля')
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Ошибка сброса пароля'));
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        if (action.payload) {
          state.user = action.payload;
          state.isLoggedIn = true;
        } else {
          state.user = null;
          state.isLoggedIn = false;
        }
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
        state.isLoggedIn = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isLoggedIn = true;
          state.isAuthChecked = true;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setUser, logout, setAuthChecked } = authSlice.actions;
export const authReducer = authSlice.reducer;
