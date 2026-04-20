import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

// Сопоставление статусов заказа с текстом для отображения
const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

// Компонент для отображения статуса заказа с цветом и текстом
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  // Определяем цвет текста в зависимости от статуса
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
