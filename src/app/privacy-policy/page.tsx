import Link from 'next/link';
import { SiteShell } from '@/components/SiteShell';
import { createMetadata, seoPages } from '@/lib/seo';

const updatedDate = '15 May 2026';

export const metadata = createMetadata(seoPages.privacyPolicy);

export default function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <main className="legal-page">
        <section className="page-hero">
          <p className="eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p>
            This policy explains how EmpowerFin handles personal information when you use this website or contact us
            about mortgage and finance services.
          </p>
        </section>

        <section className="legal-content">
          <p>
            <strong>Last updated:</strong> {updatedDate}
          </p>

          <h2>Who We Are</h2>
          <p>
            Empower Finance Pty Ltd is a credit representative (No. 000571186) of Finsure and Insurance Pty Ltd
            (Australian Credit License No. 384704). In this policy, “EmpowerFin”, “we”, “us”, and “our” refer to
            Empower Finance Pty Ltd.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We may collect personal information you provide through this website, email, phone, forms, or consultations.
            This may include your name, contact details, suburb or address, employment and income details, loan goals,
            property information, and other details relevant to mortgage or finance enquiries.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use personal information to respond to enquiries, assess your finance needs, prepare for consultations,
            communicate with you, provide general lending information, and support any application or referral process
            you ask us to assist with.
          </p>

          <h2>Sharing Your Information</h2>
          <p>
            Where needed, we may share information with lenders, aggregators, credit representatives, service providers,
            professional advisers, or regulators. We only share information where it is reasonably required for the
            service requested, permitted by law, or with your consent.
          </p>

          <h2>Website Data</h2>
          <p>
            This website may collect basic technical information such as browser type, device information, pages visited,
            and enquiry form activity. This helps us maintain the website, understand how visitors use it, and improve
            the online experience.
          </p>

          <h2>Security</h2>
          <p>
            We take reasonable steps to protect personal information from misuse, interference, loss, unauthorised
            access, modification, or disclosure. No online transmission or storage method is completely secure, so please
            avoid sending highly sensitive documents through unsecured channels unless requested through an appropriate
            process.
          </p>

          <h2>Access And Correction</h2>
          <p>
            You may ask to access or correct personal information we hold about you. We may need to verify your identity
            before responding to the request.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this policy or how your information is handled, contact us at{' '}
            <Link href="mailto:puneet@empowerfin.com.au">puneet@empowerfin.com.au</Link> or{' '}
            <Link href="tel:+61456697919">+61 456697919</Link>.
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
