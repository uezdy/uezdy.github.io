import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Уезды Беларуси (Генеалогия Беларуси)",
  description: `Группа для общения на тему генеалогии Беларуси. Обмен опытом, поиск совета и помощи. При вступлении рекомендуется назвать ваши искомые уезды, чтобы найти единомышленников по вашим местам.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <link rel="stylesheet" href="https://telegram.org/css/widget-frame.css?68"></link>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
