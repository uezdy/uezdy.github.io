import styles from './TelegramPostEmbed.module.css';

type TelegramPostEmbedProps = {
  embedUrl: string;
};

export function TelegramPostEmbed({ embedUrl }: TelegramPostEmbedProps) {
  return (
    <div className={styles.root}>
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title="Сообщение в Telegram"
      />
    </div>
  );
}
