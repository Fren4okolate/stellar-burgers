import { FC, memo } from 'react';

import styles from './modal.module.css';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';

// Компонент модального окна
export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => (
    <>
      <div className={styles.modal} data-modal>
        <div className={styles.header}>
          <h3
            className={
              typeof title === 'string' && /^#?\d+$/.test(title.trim())
                ? `${styles.title} text text_type_digits-medium`
                : `${styles.title} text text_type_main-large`
            }
          >
            {title}
          </h3>
          <button className={styles.button} type='button' data-close>
            <CloseIcon type='primary' onClick={onClose} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlayUI onClick={onClose} data-modal-overlay />
    </>
  )
);
