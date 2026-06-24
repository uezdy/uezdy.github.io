import {
  getReactionKey,
  getReactionLabel,
} from '@/lib/messageReactions';
import type { MessageReaction } from '@/types/telegram';
import styles from './MessageReactions.module.css';

type MessageReactionsProps = {
  reactions: MessageReaction[];
};

function ReactionGlyph({ reaction }: { reaction: MessageReaction }) {
  if (reaction.type === 'emoji') {
    return <span className={styles.emoji}>{reaction.emoji}</span>;
  }

  if (reaction.type === 'custom_emoji') {
    return (
      <span
        className={styles.customEmoji}
        title={getReactionLabel(reaction)}
        aria-hidden="true"
      />
    );
  }

  return (
    <span className={styles.emoji} title={getReactionLabel(reaction)}>
      ⭐
    </span>
  );
}

export function MessageReactions({ reactions }: MessageReactionsProps) {
  if (!reactions.length) {
    return null;
  }

  return (
    <div className={styles.row} aria-label="Реакции">
      {reactions.map((reaction) => (
        <span
          key={getReactionKey(reaction)}
          className={`${styles.chip} ${reaction.chosen ? styles.chipChosen : ''}`}
          title={getReactionLabel(reaction)}
        >
          <ReactionGlyph reaction={reaction} />
          <span className={styles.count}>{reaction.count}</span>
        </span>
      ))}
    </div>
  );
}
