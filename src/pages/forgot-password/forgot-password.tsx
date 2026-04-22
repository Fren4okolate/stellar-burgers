import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { forgotPassword } from '../../services/slices/auth/auth';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setErrorText(undefined);
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err) {
      setErrorText(
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Ошибка восстановления пароля'
      );
    }
  };

  return (
    <ForgotPasswordUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
