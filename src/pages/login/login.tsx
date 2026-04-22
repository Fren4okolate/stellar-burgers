import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/auth/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const getErrorText = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : typeof err === 'string' ? err : fallback;

// Компонент авторизации пользователя
export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Обработка отправки формы авторизации на сервер
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } catch (err) {
      setErrorText(getErrorText(err, 'Ошибка авторизации'));
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
