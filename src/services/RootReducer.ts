import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients/ingredients';
import { constructorReducer } from './slices/constructor/constructor';
import { feedReducer } from './slices/feed/feed';
import { authReducer } from './slices/auth/auth';

// Корневой редьюсер
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  auth: authReducer,
  feed: feedReducer
});
