import { FC, ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '@ui';
import { getUserApi } from '@api';
import {
  setUser,
  setAuthChecked,
  logout
} from '../../services/slices/auth/auth';

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
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);
  const dispatch = useDispatch();
  const location = useLocation();

  // Проверяем авторизацию при первом рендере
  useEffect(() => {
    if (!isAuthChecked) {
      getUserApi()
        .then((res) => {
          if (res && res.user) {
            dispatch(setUser(res.user)); // если пользователь найден — авторизуем
          } else {
            dispatch(setAuthChecked(true)); // если нет — просто отмечаем, что проверка завершена
          }
        })
        .catch((err) => {
          if (err?.message === 'refreshToken expired') {
            dispatch(logout()); // если refreshToken истёк — разлогиниваем
          } else {
            dispatch(setAuthChecked(true));
          }
        });
    }
  }, [dispatch, isAuthChecked]);

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
