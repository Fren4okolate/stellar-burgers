import { rootReducer } from './RootReducer';

describe('rootReducer', () => {
  it('инициализируется без ошибок', () => {
    // Диспатчим экшен инициализации rootReducer
    const state = rootReducer(undefined, { type: '@@INIT' });
    // Проверяем, что state определён
    expect(state).toBeDefined();
    // Проверяем, что в state есть ключ ingredients
    expect(state).toHaveProperty('ingredients');
    // Проверяем, что в state есть ключ burgerConstructor
    expect(state).toHaveProperty('burgerConstructor');
    // Проверяем, что в state есть ключ auth
    expect(state).toHaveProperty('auth');
    // Проверяем, что в state есть ключ feed
    expect(state).toHaveProperty('feed');
  });
});
