import { CalculatorsPage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const metadata = createMetadata(seoPages.calculators);

export default function CalculatorsRoute() {
  return <CalculatorsPage />;
}
