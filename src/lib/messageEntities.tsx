import type { TextEntity } from '@/types/telegram';

type MessageTextProps = {
  entities: TextEntity[];
  className?: string;
};

function renderEntity(entity: TextEntity, key: number) {
  switch (entity.type) {
    case 'link':
      return (
        <a
          key={key}
          href={entity.text}
          target="_blank"
          rel="noopener noreferrer"
        >
          {entity.text}
        </a>
      );
    case 'mention':
      return (
        <a
          key={key}
          href={`https://t.me/${entity.text.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {entity.text}
        </a>
      );
    case 'mention_name':
      return (
        <a
          key={key}
          href={`https://t.me/${entity.user_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {entity.text}
        </a>
      );
    case 'text_link':
      return (
        <a
          key={key}
          href={entity.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {entity.text}
        </a>
      );
    case 'hashtag':
      return <b key={key}>{entity.text}</b>;
    case 'bold':
      return <b key={key}>{entity.text}</b>;
    case 'italic':
      return <i key={key}>{entity.text}</i>;
    case 'underline':
      return <u key={key}>{entity.text}</u>;
    case 'strikethrough':
      return <s key={key}>{entity.text}</s>;
    case 'code':
    case 'pre':
      return <code key={key}>{entity.text}</code>;
    case 'email':
      return (
        <a key={key} href={`mailto:${entity.text}`}>
          {entity.text}
        </a>
      );
    case 'phone':
      return (
        <a key={key} href={`tel:${entity.text}`}>
          {entity.text}
        </a>
      );
    default:
      return <span key={key}>{entity.text}</span>;
  }
}

export function MessageText({ entities, className }: MessageTextProps) {
  return (
    <p className={className}>
      {entities.map((entity, index) => renderEntity(entity, index))}
    </p>
  );
}
