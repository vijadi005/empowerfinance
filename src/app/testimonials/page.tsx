import { TestimonialsPage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const metadata = createMetadata(seoPages.testimonials);

export default function TestimonialsRoute() {
  return <TestimonialsPage />;
}
