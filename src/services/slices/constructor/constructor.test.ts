import {
  constructorReducer,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructor';

// Мок-ингредиент для тестов (TConstructorIngredient)
const mockIngredient = {
  _id: '1',
  id: '1',
  name: 'test',
  type: 'main',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};
// Мок-булка (TIngredient)
const mockBun = {
  _id: 'b',
  name: 'bun',
  type: 'bun',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0
};

describe('constructorReducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  it('добавляет ингредиент', () => {
    // Диспатчим экшен addIngredient с моковым ингредиентом
    const action = addIngredient(mockIngredient);
    // Получаем новый state после добавления ингредиента
    const state = constructorReducer(initialState, action);
    // Проверяем, что ингредиент добавлен в массив
    expect(state.ingredients).toHaveLength(1);
    // Проверяем, что id добавленного ингредиента совпадает с ожидаемым
    expect(state.ingredients[0].id).toBe('1');
  });

  it('добавляет булку', () => {
    // Диспатчим экшен setBun с моковой булкой
    const action = setBun(mockBun);
    // Получаем новый state после установки булки
    const state = constructorReducer(initialState, action);
    // Проверяем, что в состоянии сохранилась выбранная булка
    expect(state.bun).toEqual(mockBun);
  });

  it('удаляет ингредиент', () => {
    // Создаём state с одним ингредиентом
    const startState = { ...initialState, ingredients: [mockIngredient] };
    // Диспатчим экшен removeIngredient по id
    const action = removeIngredient('1');
    // Получаем новый state после удаления ингредиента
    const state = constructorReducer(startState, action);
    // Проверяем, что ингредиентов не осталось
    expect(state.ingredients).toHaveLength(0);
  });

  it('меняет порядок ингредиентов', () => {
    // Создаём state с тремя ингредиентами
    const ingA = { ...mockIngredient, id: '1', name: 'a' };
    const ingB = { ...mockIngredient, id: '2', name: 'b' };
    const ingC = { ...mockIngredient, id: '3', name: 'c' };
    const startState = { ...initialState, ingredients: [ingA, ingB, ingC] };
    // Диспатчим экшен moveIngredient (перемещаем первый элемент на последнее место)
    const action = moveIngredient({ from: 0, to: 2 });
    // Получаем новый state после перемещения
    const state = constructorReducer(startState, action);
    // Проверяем, что ингредиент с id '1' теперь на позиции 2
    expect(state.ingredients[2].id).toBe('1');
  });

  it('очищает конструктор', () => {
    // Создаём state с булкой и ингредиентом
    const startState = { ...initialState, bun: mockBun, ingredients: [mockIngredient] };
    // Диспатчим экшен clearConstructor
    const state = constructorReducer(startState, clearConstructor());
    // Проверяем, что булка удалена
    expect(state.bun).toBeNull();
    // Проверяем, что ингредиенты очищены
    expect(state.ingredients).toHaveLength(0);
  });
});
