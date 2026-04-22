import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { resetPassword } from '../../services/slices/auth/auth';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText(undefined);
    try {
      await dispatch(resetPassword({ password, token })).unwrap();
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (err) {
      setErrorText(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Ошибка сброса пароля'
      );
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={errorText}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
