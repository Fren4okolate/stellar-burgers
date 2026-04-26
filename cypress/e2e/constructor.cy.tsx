/// <reference types="cypress" />

describe('Тестирование работы конструктора бургеров', () => {
  // Перед каждым тестом мокаем запросы и открываем главную страницу
  beforeEach(() => {
    //  Мокаем запрос ингредиентов и заказов
    cy.intercept('GET', '**/api/ingredients', { statusCode: 200, fixture: 'ingredients' }).as('getIngredients');
    cy.intercept('GET', '**/api/orders/all', { statusCode: 200, fixture: 'orders-all' });
    cy.visit('/');
    // Ждем загрузки ингредиентов и сохраняем их в alias
    cy.wait('@getIngredients');
    cy.get('[data-ingredient]').as('ingredient');
  });

  it('Отображает ингредиенты из моков (проверка загрузки)', () => {
    // Проверяем, что на странице есть нужные ингредиенты из моков
    cy.contains('Биокотлета из марсианской Магнолии');
    cy.contains('Краторная булка N-200i');
    cy.contains('Соус Spicy-X');
  });

  it('Позволяет добавить ингредиент в конструктор', () => {
    // Проверяем, что ингредиенты доступны
    cy.get('@ingredient').its('length').should('be.gte', 1);
    // Добавляем первый ингредиент (булку)
    cy.get('@ingredient').first().as('firstIngredient');
    cy.get('@firstIngredient').find('button').click();
    // Проверяем, что ингредиент появился в конструкторе
    cy.get('@firstIngredient').find('p.text_type_main-default').invoke('text').then((ingredientName) => {
      cy.get('[data-constructor]').should('contain.text', `${ingredientName.trim()} (верх)`);
    });
  });

  it('Добавляет начинку в конструктор', () => {
    // Добавляем булку
    cy.get('@ingredient').first().find('button').click();
    // Добавляем начинку 
    cy.contains('[data-ingredient]', 'Биокотлета из марсианской Магнолии').find('button').click();
    // Проверяем, что начинка появилась в конструкторе
    cy.get('[data-constructor]').should('contain.text', 'Биокотлета из марсианской Магнолии');
  });
});

// Проверяем открытие и закрытие модального окна с деталями ингредиента
describe('Проверка работы модальных окон', () => {
  beforeEach(() => {
    // Мокаем запрос ингредиентов и заказов
    cy.intercept('GET', '**/api/ingredients', { statusCode: 200, fixture: 'ingredients' }).as('getIngredients');
    cy.intercept('GET', '**/api/orders/all', { statusCode: 200, fixture: 'orders-all' });
    cy.visit('/');
    // Ждем загрузки ингредиентов и сохраняем их в alias
    cy.wait('@getIngredients');
    cy.get('[data-ingredient]').as('ingredient');
  });

  it('Открывает модальное окно с информацией об ингредиенте', () => {
    // Кликаем по первому ингредиенту и проверяем, что открылась модалка с его названием
    cy.get('@ingredient').first().as('firstIngredient');
    cy.get('@firstIngredient').find('p.text_type_main-default').invoke('text').then((ingredientName) => {
      cy.get('@firstIngredient').click();
      cy.get('[data-test="ingredient-title"]').should('contain.text', ingredientName.trim());
    });
  });

  it('Закрывает модальное окно по клику по крестику', () => {
    // Открываем модалку и закрываем по крестику
    cy.get('@ingredient').first().click();
    cy.get('[data-close]').click();
    cy.get('[data-test="ingredient-title"]').should('not.exist');
  });
});

// mockAuth() — вспомогательная функция для установки токенов в cookie и localStorage
function mockAuth() {
  cy.setCookie('accessToken', 'mocked_access_token');
  localStorage.setItem('refreshToken', 'mocked_refresh_token');
}

// Проверяем сценарий успешного оформления заказа и сценарий для неавторизованного пользователя
describe('Тестирование создания заказа', () => {
  beforeEach(() => {
    // Мокаем авторизацию и заказ, выставляем токены
    cy.setCookie('accessToken', 'mocked_access_token', { path: '/' });
    localStorage.setItem('accessToken', 'mocked_access_token');
    localStorage.setItem('refreshToken', 'mocked_refresh_token');
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order' }).as('createOrder');
    cy.visit('/');
    // Логируем состояние для отладки
    cy.window().then(win => {
      cy.log('cookie:', win.document.cookie);
      cy.log('localStorage accessToken:', win.localStorage.getItem('accessToken'));
      cy.log('localStorage refreshToken:', win.localStorage.getItem('refreshToken'));
    });
    cy.reload();
    cy.wait('@getIngredients');
    cy.get('[data-ingredient]').as('ingredient');
  });

  it('Создает и отправляет заказ, открытие модалки c номером, закрытие', () => {
    // Добавляем булку и начинку
    cy.get('@ingredient').first().find('button').click();
    cy.contains('[data-ingredient]', 'Биокотлета из марсианской Магнолии').find('button').click();
    // Кликаем по кнопке заказа
    cy.get('[data-order-button]').click();
    // Проверяем, что открылась модалка с номером заказа
    cy.get('[data-modal]', { timeout: 12000 }).should('exist');
    cy.get('[data-modal]').should('contain.text', '12345');
    // Закрываем модалку
    cy.get('[data-close]').click();
    cy.get('[data-modal]').should('not.exist');
    // Проверяем, что конструктор пуст
    cy.get('[data-constructor]').find('[data-ingredient]').should('not.exist');
  });

  it('Кнопка заказа недоступна для неавторизованного пользователя', () => {
    // Очищаем куки и localStorage, имитируем неавторизованного пользователя
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('accessToken');
    cy.clearLocalStorage('refreshToken');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get('[data-ingredient]').as('ingredient');
    cy.get('@ingredient').first().find('button').click();
    cy.contains('[data-ingredient]', 'Биокотлета из марсианской Магнолии').find('button').click();
    // Проверяем, что кнопка заказа неактивна
    cy.get('[data-order-button]').should('be.disabled');
  });

  // После каждого теста очищаем куки и localStorage 
  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage('accessToken');
    cy.clearLocalStorage('refreshToken');
  });
});
