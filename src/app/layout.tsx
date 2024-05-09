import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Social Media Image Captioning',
  description: 'Image captioning web application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
