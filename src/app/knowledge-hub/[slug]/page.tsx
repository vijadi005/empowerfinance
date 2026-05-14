import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/SiteShell';
import { getBlogPostBySlug } from '@/lib/wordpress';

type BlogPostRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function BlogPostRoute({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <SiteShell>
      <main>
        <article className="blog-post">
          <div className="blog-post-hero">
            <Link className="text-link" href="/knowledge-hub">
              Back to blogs
            </Link>
            <span>{post.date ? `${post.category} / ${post.date}` : post.category}</span>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
          </div>
          <Image
            className="blog-post-image"
            src={post.image}
            alt=""
            width={1400}
            height={820}
            sizes="(max-width: 980px) 100vw, 1180px"
            priority
          />
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </SiteShell>
  );
}
