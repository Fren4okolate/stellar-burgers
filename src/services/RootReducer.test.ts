import { rootReducer } from './RootReducer';
import { constructorReducer } from './slices/constructor/constructor';
import { feedReducer } from './slices/feed/feed';
import { ingredientsReducer } from './slices/ingredients/ingredients';
import { authReducer } from './slices/auth/auth';

describe('rootReducer', () => {
  it('handles unknown action correctly', () => {
    const initAction = { type: '@@init' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      auth: authReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction)
    });
  });
});
