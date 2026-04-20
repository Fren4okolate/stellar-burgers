import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '@api';
import { useDispatch } from '../../services/store';
import { setUser } from '../../services/slices/auth/auth';
import { useNavigate } from 'react-router-dom';

// Компонент авторизации пользователя
export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработка отправки формы авторизации на сервер
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      const res = await loginUserApi({ email, password });
      if (res && res.user) {
        localStorage.setItem('refreshToken', res.refreshToken);
        document.cookie = `accessToken=${res.accessToken}`;
        dispatch(setUser(res.user));
        navigate('/profile', { replace: true });
      }
    } catch (err: any) {
      setErrorText(err?.message || 'Ошибка авторизации');
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
