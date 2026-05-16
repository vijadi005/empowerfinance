import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans } from 'next/font/google';
import { siteMetadata } from '@/lib/site-data';
import './globals.css';

export const metadata: Metadata = siteMetadata;

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-google-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={notoSans.variable} suppressHydrationWarning>{children}</body>
    </html>
  );
}
