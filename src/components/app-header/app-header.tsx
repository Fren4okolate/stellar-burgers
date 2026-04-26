import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors/authSelectors';
import { AppHeaderUI } from '@ui';

// Компонент шапки приложения
export const AppHeader: FC = () => {
  const userName = useSelector(selectUser)?.name || '';

  return <AppHeaderUI userName={userName} />;
};
