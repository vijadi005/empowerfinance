import { ContactPage } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

export const metadata = createMetadata(seoPages.contact);

export default function ContactRoute() {
  return <ContactPage />;
}
