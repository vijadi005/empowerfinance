import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Roboto_Condensed } from 'next/font/google';
import { siteMetadata } from '@/lib/site-data';
import { financialServiceJsonLd, siteUrl } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  ...siteMetadata,
  metadataBase: new URL(siteUrl),
  applicationName: 'EmpowerFin',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'mortgage broker',
    'finance consultant',
    'home loans',
    'investment loans',
    'refinancing',
    'construction loans',
    'Warragul mortgage broker',
    'Australian mortgage broker',
  ],
  authors: [{ name: 'EmpowerFin' }],
  creator: 'EmpowerFin',
  publisher: 'EmpowerFin',
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteUrl,
    siteName: 'EmpowerFin',
    images: [
      {
        url: '/images/homehero.jpg',
        width: 1200,
        height: 630,
        alt: 'EmpowerFin mortgage and finance consulting',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ['/images/homehero.jpg'],
  },
};

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
  const jsonLd = financialServiceJsonLd();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cx(robotoCondensed.className, robotoCondensed.variable)} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {children}
      </body>
    </html>
  );
}
