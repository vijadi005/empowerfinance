import { HomePage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata = createMetadata(seoPages.home);

export default function Home() {
  return <HomePage />;
}
