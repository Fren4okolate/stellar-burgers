import { ingredientsReducer } from './ingredients';
import { loadIngredients } from './ingredients';

describe('ingredientsReducer', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  it('устанавливает isLoading=true при загрузке ингредиентов', () => {
    // Диспатчим экшен loadIngredients.pending 
    const action = { type: loadIngredients.pending.type };
    // Получаем новый state после начала загрузки
    const state = ingredientsReducer(initialState, action);
    // Проверяем, что isLoading стал true
    expect(state.isLoading).toBe(true);
    // Проверяем, что ошибка сброшена
    expect(state.error).toBeNull();
  });

  it('записывает ингредиенты и isLoading=false при успешной загрузке', () => {
    // Мокаем массив ингредиентов
    const ingredients = [{ _id: '1', name: 'test', type: 'bun', proteins: 1, fat: 1, carbohydrates: 1, calories: 1, price: 1, image: '', image_mobile: '', image_large: '', __v: 0 }];
    // Диспатчим экшен loadIngredients.fulfilled 
    const action = { type: loadIngredients.fulfilled.type, payload: ingredients };
    // Получаем новый state после успешной загрузки
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    // Проверяем, что загрузка завершена
    expect(state.isLoading).toBe(false);
    // Проверяем, что ингредиенты записаны в state
    expect(state.items).toEqual(ingredients);
  });

  it('записывает ошибку и isLoading=false при ошибке загрузки', () => {
    // Мокаем ошибку
    const error = 'Ошибка';
    // Диспатчим экшен loadIngredients.rejected 
    const action = { type: loadIngredients.rejected.type, payload: error };
    // Получаем новый state после ошибки
    const state = ingredientsReducer({ ...initialState, isLoading: true }, action);
    // Проверяем, что загрузка завершена
    expect(state.isLoading).toBe(false);
    // Проверяем, что ошибка записана в state
    expect(state.error).toBe(error);
  });
});
