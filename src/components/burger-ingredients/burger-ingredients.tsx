import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from '../../services/store';
import { loadIngredients } from '../../services/slices/ingredients/ingredients';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

// Компонент списка ингредиентов для конструктора бургера
export const BurgerIngredients: FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.ingredients);

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!items.length) {
      dispatch(loadIngredients());
    }
  }, [dispatch, items.length]);

  // Массивы ингредиентов по категориям
  const buns = useMemo(() => items.filter((i) => i.type === 'bun'), [items]);
  const mains = useMemo(() => items.filter((i) => i.type === 'main'), [items]);
  const sauces = useMemo(
    () => items.filter((i) => i.type === 'sauce'),
    [items]
  );

  // Текущая активная вкладка
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Индикаторы видимости для категорий
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Автоматическое переключение вкладки при прокрутке
  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по вкладке: переключает вкладку и скроллит к нужной категории
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
