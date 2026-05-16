import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto_Condensed } from 'next/font/google';
import { siteMetadata } from '@/lib/site-data';
import './globals.css';

export const metadata: Metadata = siteMetadata;

function cx(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cx(robotoCondensed.className, robotoCondensed.variable)} suppressHydrationWarning>{children}</body>
    </html>
  );
}
