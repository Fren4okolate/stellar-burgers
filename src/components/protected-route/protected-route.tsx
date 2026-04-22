import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import {
  selectIsAuthChecked,
  selectIsLoggedIn
} from '../../services/selectors/authSelectors';

// Тип пропсов для защищённого маршрута
interface ProtectedRouteProps {
  children: ReactElement;
  anonymous?: boolean;
}

// Компонент защищённого маршрута
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false
}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  // Пока идёт проверка авторизации — показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если маршрут только для неавторизованных, а пользователь уже залогинен — редирект на главную
  if (anonymous && isLoggedIn) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} replace />;
  }

  // Если маршрут только для авторизованных, а пользователь не залогинен — редирект на /login
  if (!anonymous && !isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если всё ок — рендерим дочернние элементы
  return children;
};
