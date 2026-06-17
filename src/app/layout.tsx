import type { Metadata, Viewport } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Telegram Archives',
  description: 'Архивы сообщений Telegram-групп для индексации поисковыми системами',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
