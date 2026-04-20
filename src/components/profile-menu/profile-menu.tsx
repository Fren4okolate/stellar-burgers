import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/auth/auth';
import { logoutApi } from '@api';

// Компонент меню профиля пользователя
export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработчик выхода из аккаунта
  const handleLogout = async () => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0; path=/;';
      dispatch(logout());
      navigate('/login', { replace: true });
    } catch (e) {}
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
