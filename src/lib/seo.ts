import type { Metadata } from 'next';
import { brand, contact, pageHeroes, siteMetadata } from '@/lib/site-data';

export const siteUrl = 'https://empowerfin.com.au';

const defaultImage = '/images/homehero.jpg';

type SeoPage = {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
};

export const seoPages = {
  home: {
    title: 'EmpowerFin | Mortgage Broker & Finance Consultant',
    description:
      'EmpowerFin helps Australian home buyers, investors, refinancers, and business owners compare lending options and make clearer finance decisions.',
    path: '/',
    image: '/images/homehero.jpg',
  },
  homeRoute: {
    title: 'EmpowerFin | Mortgage Broker & Finance Consultant',
    description:
      'EmpowerFin helps Australian home buyers, investors, refinancers, and business owners compare lending options and make clearer finance decisions.',
    path: '/home',
    image: '/images/homehero.jpg',
  },
  about: {
    title: 'About EmpowerFin | Puneet Maheshwari',
    description: pageHeroes.about.copy,
    path: '/about',
    image: pageHeroes.about.image,
  },
  services: {
    title: 'Mortgage & Finance Services | EmpowerFin',
    description: pageHeroes.services.copy,
    path: '/services',
    image: pageHeroes.services.image,
  },
  knowledgeHub: {
    title: 'Mortgage & Finance Blog | EmpowerFin',
    description: pageHeroes.knowledgeHub.copy,
    path: '/knowledge-hub',
    image: pageHeroes.knowledgeHub.image,
  },
  testimonials: {
    title: 'Client Testimonials | EmpowerFin',
    description: pageHeroes.testimonials.copy,
    path: '/testimonials',
    image: pageHeroes.testimonials.image,
  },
  calculators: {
    title: 'Australian Mortgage Calculators | EmpowerFin',
    description: pageHeroes.calculators.copy,
    path: '/calculators',
    image: pageHeroes.calculators.image,
  },
  contact: {
    title: 'Contact EmpowerFin | Free Loan Review',
    description: pageHeroes.contact.copy,
    path: '/contact',
    image: pageHeroes.contact.image,
  },
  privacyPolicy: {
    title: 'Privacy Policy | EmpowerFin',
    description: 'Learn how EmpowerFin handles personal information for mortgage and finance enquiries.',
    path: '/privacy-policy',
    image: defaultImage,
    noIndex: true,
  },
} satisfies Record<string, SeoPage>;

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) {
    return path;
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function createMetadata(page: SeoPage): Metadata {
  const image = absoluteUrl(page.image || defaultImage);
  const canonical = absoluteUrl(page.path);

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: brand.name,
      type: 'website',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [image],
    },
    robots: page.noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export function createArticleMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const metadata = createMetadata({
    title: `${title} | EmpowerFin`,
    description,
    path,
    image: image || defaultImage,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
    },
  };
}

export function financialServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `${siteUrl}/#financial-service`,
    name: brand.name,
    url: siteUrl,
    logo: absoluteUrl(brand.logo),
    image: absoluteUrl(defaultImage),
    description: siteMetadata.description,
    telephone: contact.phone,
    email: contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6 Peppercorn Crescent',
      addressLocality: 'Warragul',
      addressRegion: 'VIC',
      postalCode: '3820',
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Australia',
    },
    founder: {
      '@type': 'Person',
      name: 'Puneet Maheshwari',
      jobTitle: 'Founder & Credit Specialist',
    },
    sameAs: [siteUrl],
  };
}
