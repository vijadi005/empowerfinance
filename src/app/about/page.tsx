import { AboutPage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const metadata = createMetadata(seoPages.about);

export default function AboutRoute() {
  return <AboutPage />;
}
