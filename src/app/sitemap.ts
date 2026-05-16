import type { MetadataRoute } from 'next';
import { articles } from '@/lib/site-data';
import { absoluteUrl, seoPages } from '@/lib/seo';

const staticPages = [
  seoPages.home,
  seoPages.homeRoute,
  seoPages.about,
  seoPages.services,
  seoPages.knowledgeHub,
  seoPages.testimonials,
  seoPages.calculators,
  seoPages.contact,
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries = staticPages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified: now,
    changeFrequency: page.path === '/' || page.path === '/home' ? ('weekly' as const) : ('monthly' as const),
    priority: page.path === '/' ? 1 : 0.8,
  }));

  const articleEntries = articles.map((article) => ({
    url: absoluteUrl(`/knowledge-hub/${slugify(article.title)}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
