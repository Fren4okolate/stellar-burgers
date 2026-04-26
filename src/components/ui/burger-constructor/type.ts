import { TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  burgerConstructor: any;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
  isOrderDisabled?: boolean;
};
