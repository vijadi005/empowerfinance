import Image from 'next/image';
import Link from 'next/link';
import { defaultSiteContent, type SiteContent } from '@/lib/site-data';

export function Footer({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { brand, contact, homeContent, navItems, services } = content;
  const footerServiceLinks = services.slice(0, 6);

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-about">
          <Link className="brand footer-brand" href="/home" aria-label={`${brand.name} home`}>
            <Image className="brand-logo" src={brand.logo} alt={`${brand.name} logo`} width={96} height={84} />
            <span>
              <strong>{brand.name}</strong>
              <small>{brand.tagline}</small>
            </span>
          </Link>
          <Link className="footer-cta" href="/contact">
            {homeContent.loanAssessment.cta}
          </Link>
        </div>

        <div className="footer-links">
          <h2>Explore</h2>
          {navItems.slice(1).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-links">
          <h2>Services</h2>
          {footerServiceLinks.map((service) => (
            <Link key={service.title} href="/services">
              {service.title}
            </Link>
          ))}
        </div>

        <div className="footer-contact">
          <h2>Contact</h2>
          <p>{contact.address}</p>
          <Link href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</Link>
          <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
          <span>{contact.licence}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          The information on this website is general in nature and does not take into account your personal
          circumstances. Please seek personalised advice before making financial decisions.
        </p>
        <p>
          Empower Finance Pty Ltd is a credit representative (No. 000571186) of Finsure and Insurance Pty Ltd
          (Australian Credit License No. 384704).
        </p>
        <span>
          © {new Date().getFullYear()} {brand.name}. All rights reserved.{' '}
          <Link href="/privacy-policy">Privacy Policy</Link>
        </span>
      </div>
    </footer>
  );
}
