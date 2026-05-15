import { articles } from '@/lib/site-data';
import https from 'node:https';
import { gql } from 'graphql-request';

export type BlogArticle = {
  title: string;
  category: string;
  image: string;
  excerpt: string;
  href: string;
  slug: string;
  date: string;
};

export type BlogPost = BlogArticle & {
  content: string;
  sourceUrl: string;
};

type WordPressImageSize = {
  name?: string | null;
  sourceUrl?: string | null;
};

type WordPressPost = {
  date?: string | null;
  slug?: string | null;
  link?: string | null;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      mediaDetails?: {
        sizes?: WordPressImageSize[] | null;
      } | null;
    } | null;
  } | null;
  categories?: {
    nodes?: Array<{ name?: string | null }> | null;
  } | null;
};

type BlogPostsQueryResponse = {
  posts?: {
    nodes?: WordPressPost[] | null;
  } | null;
};

type BlogPostBySlugQueryResponse = {
  postBy?: WordPressPost | null;
};

const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL || 'https://empowerfin.com.au';
const WORDPRESS_GRAPHQL_ENDPOINT = process.env.WORDPRESS_GRAPHQL_ENDPOINT || `${WORDPRESS_SITE_URL}/graphql`;
const WORDPRESS_GRAPHQL_ORIGIN_IP = process.env.WORDPRESS_GRAPHQL_ORIGIN_IP || '160.153.0.75';
const WORDPRESS_ORIGIN_ENDPOINT = new URL('https://empowerfin.com.au/graphql');

const blogPostFields = gql`
  fragment BlogPostFields on Post {
    date
    slug
    link
    title
    excerpt
    content
    featuredImage {
      node {
        sourceUrl
        mediaDetails {
          sizes {
            name
            sourceUrl
          }
        }
      }
    }
    categories {
      nodes {
        name
      }
    }
  }
`;

const blogPostsQuery = gql`
  ${blogPostFields}

  query BlogPosts($first: Int!) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        ...BlogPostFields
      }
    }
  }
`;

const blogPostBySlugQuery = gql`
  ${blogPostFields}

  query BlogPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      ...BlogPostFields
    }
  }
`;

async function requestWordPress<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const endpoint = new URL(WORDPRESS_GRAPHQL_ENDPOINT);

  if (WORDPRESS_GRAPHQL_ORIGIN_IP && endpoint.hostname === 'empowerfin.com.au') {
    return requestWordPressOrigin<T>(endpoint, query, variables);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const result = (await response.json()) as { data?: T; errors?: unknown };

    if (!response.ok || result.errors || !result.data) {
      throw new Error('WordPress GraphQL request failed');
    }

    return result.data;
  } catch (error) {
    if (WORDPRESS_GRAPHQL_ORIGIN_IP) {
      return requestWordPressOrigin<T>(WORDPRESS_ORIGIN_ENDPOINT, query, variables);
    }

    throw error;
  }
}

function requestWordPressOrigin<T>(
  endpoint: URL,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const body = JSON.stringify({ query, variables });

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: WORDPRESS_GRAPHQL_ORIGIN_IP,
        servername: endpoint.hostname,
        path: `${endpoint.pathname}${endpoint.search}`,
        method: 'POST',
        headers: {
          Host: endpoint.hostname,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (response) => {
        let responseBody = '';

        response.on('data', (chunk) => {
          responseBody += chunk;
        });

        response.on('end', () => {
          try {
            const result = JSON.parse(responseBody) as { data?: T; errors?: unknown };

            if ((response.statusCode && response.statusCode >= 400) || result.errors || !result.data) {
              reject(new Error('WordPress origin GraphQL request failed'));
              return;
            }

            resolve(result.data);
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on('error', reject);
    request.end(body);
  });
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '-')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(value: string) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function cleanTitle(value: string) {
  return decodeHtml(value.replace(/^hello/i, '').replace(/hello$/i, '').trim());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFeaturedImage(post: WordPressPost) {
  const sizes = post.featuredImage?.node?.mediaDetails?.sizes || [];
  const largeImage = sizes.find((size) => size.name === 'large')?.sourceUrl;
  const fullImage = sizes.find((size) => size.name === 'full')?.sourceUrl;

  return largeImage || fullImage || post.featuredImage?.node?.sourceUrl || '/images/refinancing.jpeg';
}

function fallbackArticles(): BlogArticle[] {
  return articles.map((article) => ({
    ...article,
    href: `/knowledge-hub/${slugify(article.title)}`,
    slug: slugify(article.title),
    date: '',
  }));
}

function fallbackPostBySlug(slug: string): BlogPost | null {
  const article = fallbackArticles().find((fallbackArticle) => fallbackArticle.slug === slug);

  if (!article) {
    return null;
  }

  return {
    ...article,
    content: `<p>${article.excerpt}</p><p>For advice tailored to your income, deposit, goals, and borrowing position, speak with EmpowerFin before making a lending decision.</p>`,
    sourceUrl: '',
  };
}

function mapPost(post: WordPressPost): BlogPost {
  const category = post.categories?.nodes?.[0]?.name || 'Finance';
  const slug = post.slug || '';

  return {
    title: cleanTitle(post.title || ''),
    category,
    image: getFeaturedImage(post),
    excerpt: stripHtml(post.excerpt || ''),
    href: slug ? `/knowledge-hub/${slug}` : '/knowledge-hub',
    slug,
    date: post.date ? formatDate(post.date) : '',
    content: post.content || '',
    sourceUrl: post.link || '',
  };
}

export async function getBlogArticles(limit = 10): Promise<BlogArticle[]> {
  try {
    const data = await requestWordPress<BlogPostsQueryResponse>(blogPostsQuery, { first: limit });
    const posts = data.posts?.nodes || [];
    const blogArticles = posts.map(mapPost);

    return blogArticles.length ? blogArticles : fallbackArticles().slice(0, limit);
  } catch (error) {
    console.error('WordPress article list unavailable', error);
    return fallbackArticles().slice(0, limit);
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const data = await requestWordPress<BlogPostBySlugQueryResponse>(blogPostBySlugQuery, { slug });
    const post = data.postBy;

    return post ? mapPost(post) : fallbackPostBySlug(slug);
  } catch (error) {
    console.error(`WordPress article unavailable for slug: ${slug}`, error);
    return fallbackPostBySlug(slug);
  }
}
