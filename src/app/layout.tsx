import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Уезды Беларуси (Генеалогия Беларуси)",
  description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Also supported but less commonly used
    // interactiveWidget: 'resizes-visual',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <meta name="google-site-verification" content="WcZLxrvNHupEwOXBZ_xza8RMaDFrJ_7Nc_Ax_vyo0zw" />
          <meta name="yandex-verification" content="9c6b753fbeb916ac" />
          {/*<link rel="stylesheet" href="https://telegram.org/css/widget-frame.css?68"></link>*/}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
