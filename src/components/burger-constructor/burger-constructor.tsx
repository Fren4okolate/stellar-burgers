import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIsLoggedIn,
  selectIsAuthChecked
} from '../../services/selectors/authSelectors';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createOrder,
  setOrderModalData
} from '../../services/slices/constructor/constructor';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/selectors/constructorSelectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // Используем селекторы из отдельного файла
  const bun = useSelector(selectConstructorBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  // Обработчик оформления заказа
  const onOrderClick = (): void => {
    if (!bun || orderRequest) return;
    if (!isAuthChecked) return;
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  // Закрытие модального окна заказа

  const closeOrderModal = (): void => {
    dispatch(setOrderModalData(null));
  };

  // Расчёт итоговой цены заказа
  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  // Флаг блокировки кнопки заказа
  const isOrderDisabled =
    !bun || ingredients.length === 0 || orderRequest || !isAuthChecked;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      burgerConstructor={{ bun, ingredients, orderRequest, orderModalData }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      isOrderDisabled={isOrderDisabled}
    />
  );
};
