import { KnowledgeHubPage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const metadata = createMetadata(seoPages.knowledgeHub);

export default function KnowledgeHubRoute() {
  return <KnowledgeHubPage />;
}
