import {
  getMessageMediaLabel,
  type MessageMediaIconKind,
} from '@/lib/messageMedia';

type MessageMediaIconProps = {
  kind: MessageMediaIconKind;
  className?: string;
};

export function MessageMediaIcon({ kind, className }: MessageMediaIconProps) {
  const label = getMessageMediaLabel(kind);

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      role="img"
      aria-label={label}
      focusable="false"
    >
      {kind === 'photo' ? (
        <path
          fill="currentColor"
          d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
        />
      ) : (
        <path
          fill="currentColor"
          d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"
        />
      )}
    </svg>
  );
}
