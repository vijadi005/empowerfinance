import { ServicesPage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const metadata = createMetadata(seoPages.services);

export default function ServicesRoute() {
  return <ServicesPage />;
}
