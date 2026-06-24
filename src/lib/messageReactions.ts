import type { MessageReaction } from '@/types/telegram';

export function getReactionKey(reaction: MessageReaction): string {
  if (reaction.type === 'emoji') {
    return `emoji:${reaction.emoji}`;
  }

  if (reaction.type === 'custom_emoji') {
    return `custom:${reaction.document_id}`;
  }

  return 'paid';
}

export function getReactionLabel(reaction: MessageReaction): string {
  if (reaction.type === 'emoji') {
    return reaction.emoji;
  }

  if (reaction.type === 'custom_emoji') {
    return 'Custom emoji';
  }

  return 'Paid reaction';
}
