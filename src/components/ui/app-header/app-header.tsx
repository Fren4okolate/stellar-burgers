import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

// UI-компонент шапки

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onConstructorClick,
  onFeedClick,
  onProfileClick,
  isConstructorActive,
  isFeedActive,
  isProfileActive
}) => {
  // Классы для активных/неактивных пунктов меню
  const constructorClass = clsx(styles.link, {
    [styles.link_active]: isConstructorActive
  });
  const feedClass = clsx(styles.link, { [styles.link_active]: isFeedActive });
  const profileClass = clsx(styles.link, styles.link_position_last, {
    [styles.link_active]: isProfileActive
  });

  // Структура шапки
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <div onClick={onConstructorClick} className={constructorClass}>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>
          <div onClick={onFeedClick} className={feedClass}>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className='' />
          </Link>
        </div>
        <div className={profileClass} onClick={onProfileClick}>
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};
