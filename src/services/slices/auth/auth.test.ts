import { authReducer, setUser, logout, setAuthChecked } from './auth';

describe('authReducer', () => {
  const initialState = {
    user: null,
    isLoggedIn: false,
    isAuthChecked: false
  };

  const mockUser = {
    email: 'test@yandex.ru',
    name: 'Ivan'
  };

  it('устанавливает пользователя и статус авторизации', () => {
    // Диспатчим экшен setUser с моковым пользователем
    const state = authReducer(initialState, setUser(mockUser));
    // Проверяем, что пользователь записан в state
    expect(state.user).toEqual(mockUser);
    // Проверяем, что пользователь авторизован
    expect(state.isLoggedIn).toBe(true);
    // Проверяем, что статус проверки авторизации установлен
    expect(state.isAuthChecked).toBe(true);
  });

  it('разлогинивает пользователя', () => {
    // Создаём state с авторизованным пользователем
    const loggedInState = { ...initialState, user: mockUser, isLoggedIn: true, isAuthChecked: true };
    // Диспатчим экшен logout
    const state = authReducer(loggedInState, logout());
    // Проверяем, что пользователь удалён из state
    expect(state.user).toBeNull();
    // Проверяем, что пользователь не авторизован
    expect(state.isLoggedIn).toBe(false);
    // Проверяем, что статус проверки авторизации не сброшен
    expect(state.isAuthChecked).toBe(true);
  });

  it('устанавливает статус проверки авторизации', () => {
    // Диспатчим экшен setAuthChecked(true)
    const state = authReducer(initialState, setAuthChecked(true));
    // Проверяем, что статус проверки авторизации обновлён
    expect(state.isAuthChecked).toBe(true);
  });
});
