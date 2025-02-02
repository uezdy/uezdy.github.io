import type {Metadata, Viewport} from "next";
import "./globals.css";

export const metadata: Metadata = {
    verification: {
        google: "WcZLxrvNHupEwOXBZ_xza8RMaDFrJ_7Nc_Ax_vyo0zw",
        yandex: "9c6b753fbeb916ac"
    }
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
        <html lang="ru">
        <body>
            {children}
        </body>
        </html>
    );
}
