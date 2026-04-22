import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/auth/auth';

const getErrorText = (err: unknown, fallback: string): string =>
  err instanceof Error ? err.message : typeof err === 'string' ? err : fallback;

// Компонент профиля пользователя
export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || {
    name: '',
    email: ''
  };
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });
  const [updateUserError, setUpdateUserError] = useState<string | undefined>(
    undefined
  );

  // Синхронизируем значения формы с изменениями пользователя
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  // Проверяем, изменились ли значения формы относительно пользователя
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // Обработка отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateUserError(undefined);
    try {
      const dataToSend: { name: string; email: string; password?: string } = {
        name: formValue.name,
        email: formValue.email
      };
      if (formValue.password) dataToSend.password = formValue.password;
      await dispatch(updateUser(dataToSend)).unwrap();
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setUpdateUserError(getErrorText(err, 'Ошибка обновления профиля'));
    }
  };

  // Обработка отмены изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
    setUpdateUserError(undefined);
  };

  // Обработка изменения любого поля формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={updateUserError}
    />
  );
};
