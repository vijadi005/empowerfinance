import Image from 'next/image';
import Link from 'next/link';
import { defaultSiteContent, type SiteContent } from '@/lib/site-data';

export function Header({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { brand, contact, homeContent, navItems } = content;

  return (
    <>
      <div className="top-strip">
        <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
        <Link href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</Link>
      </div>
      <header className="site-header">
        <Link className="brand" href="/home" aria-label={`${brand.name} home`}>
          <Image className="brand-logo" src={brand.logo} alt={`${brand.name} logo`} width={96} height={84} />
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.tagline}</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.filter((item) => item.href !== '/testimonials').map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-cta" href="/contact">
          {homeContent.loanAssessment.eyebrow}
        </Link>
      </header>
    </>
  );
}
