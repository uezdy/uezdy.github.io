'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TelegramPostEmbed } from '@/components/messages/TelegramPostEmbed';
import styles from './MessageItem.module.css';
import modalStyles from '@/components/ui/Modal.module.css';
import buttonStyles from './TelegramMessageOpenButton.module.css';

type TelegramMessageOpenButtonProps = {
  telegramHref: string;
  embedUrl: string;
};

export function TelegramMessageOpenButton({
  telegramHref,
  embedUrl,
}: TelegramMessageOpenButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.metaOpen}
        title="Оригинал в Telegram"
        aria-label="Открыть оригинал в Telegram"
        onClick={() => setIsOpen(true)}
      >
        <svg
          className={styles.metaOpenIcon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M9.78 15.28 9.55 19.1c.39 0 .56-.17.77-.38l1.86-1.78 3.86 2.83c.71.39 1.22.18 1.4-.65l2.53-11.86h.01c.23-1.07-.39-1.49-1.1-1.23L3.16 10.3c-1.04.41-1.02.99-.18 1.25l4.64 1.45L18.2 7.5c.56-.37 1.07-.17.65.2"
          />
        </svg>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Сообщение в Telegram"
        backdropClassName={buttonStyles.backdrop}
        className={buttonStyles.dialog}
        bodyClassName={buttonStyles.body}
        footer={
          <a
            href={telegramHref}
            target="_blank"
            rel="noopener noreferrer"
            className={modalStyles.footerLink}
          >
            Открыть в Telegram
          </a>
        }
      >
        {isOpen ? <TelegramPostEmbed embedUrl={embedUrl} /> : null}
      </Modal>
    </>
  );
}
