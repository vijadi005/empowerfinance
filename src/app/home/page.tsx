import { HomePage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata = createMetadata(seoPages.homeRoute);

export default function HomeRoute() {
  return <HomePage />;
}
