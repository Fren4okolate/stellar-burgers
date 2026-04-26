import { feedReducer, addOrder, fetchFeed } from './feed';

// Мок-заказ для тестов (TOrder)
const mockOrder = {
  _id: 'order1',
  number: 2,
  status: 'done',
  name: 'Тестовый заказ',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  ingredients: [],
};

describe('feedReducer', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  it('устанавливает isLoading=true при загрузке ленты', () => {
    // Диспатчим экшен fetchFeed.pending 
    const action = { type: fetchFeed.pending.type };
    // Получаем новый state после начала загрузки
    const state = feedReducer(initialState, action);
    // Проверяем, что isLoading стал true
    expect(state.isLoading).toBe(true);
    // Проверяем, что ошибка сброшена
    expect(state.error).toBeNull();
  });

  it('записывает ленту и isLoading=false при успешной загрузке', () => {
    // Мокаем payload с заказами и статистикой
    const payload = { orders: [mockOrder], total: 1, totalToday: 1 };
    // Диспатчим экшен fetchFeed.fulfilled 
    const action = { type: fetchFeed.fulfilled.type, payload };
    // Получаем новый state после успешной загрузки
    const state = feedReducer({ ...initialState, isLoading: true }, action);
    // Проверяем, что загрузка завершена
    expect(state.isLoading).toBe(false);
    // Проверяем, что заказы записаны в state
    expect(state.orders).toEqual(payload.orders);
    // Проверяем, что статистика записана в state
    expect(state.total).toBe(1);
    expect(state.totalToday).toBe(1);
  });

  it('записывает ошибку и isLoading=false при ошибке загрузки', () => {
    // Мокаем ошибку
    const error = 'Ошибка';
    // Диспатчим экшен fetchFeed.rejected 
    const action = { type: fetchFeed.rejected.type, payload: error };
    // Получаем новый state после ошибки
    const state = feedReducer({ ...initialState, isLoading: true }, action);
    // Проверяем, что загрузка завершена
    expect(state.isLoading).toBe(false);
    // Проверяем, что ошибка записана в state
    expect(state.error).toBe(error);
  });

  it('добавляет заказ в начало ленты', () => {
    // Диспатчим экшен addOrder с моковым заказом
    const state = feedReducer(initialState, addOrder(mockOrder));
    // Проверяем, что заказ добавлен в начало массива orders
    expect(state.orders[0]).toEqual(mockOrder);
  });
});
