import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '@api';
import { useDispatch } from '../../services/store';
import { setUser } from '../../services/slices/auth/auth';
import { useNavigate } from 'react-router-dom';

//Компонент регистрации пользователя
export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработка отправки формы регистрации
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      const res = await registerUserApi({ name: userName, email, password });
      if (res && res.user) {
        localStorage.setItem('refreshToken', res.refreshToken);
        document.cookie = `accessToken=${res.accessToken}`; // сохраняем accessToken
        dispatch(setUser(res.user)); // авторизуем пользователя
        navigate('/profile', { replace: true }); // переходим в профиль
      }
    } catch (err: any) {
      setErrorText(err?.message || 'Ошибка регистрации');
    }
  };

  // Рендерим UI регистрацмии, передаём значения и обработчики
  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
