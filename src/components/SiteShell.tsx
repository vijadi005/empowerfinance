import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import {
  defaultSiteContent,
  type SiteContent,
} from '@/lib/site-data';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ContactForm } from '@/components/ContactForm';
import { getSiteContent } from '@/lib/google-sheets-content';
import { getBlogArticles, type BlogArticle } from '@/lib/wordpress';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  image?: string;
};

export function SiteShell({ children, content = defaultSiteContent }: { children: ReactNode; content?: SiteContent }) {
  return (
    <div className="site-shell">
      <Header content={content} />
      {children}
      <Footer content={content} />
    </div>
  );
}

export async function HomePage() {
  const content = await getSiteContent();
  const blogArticles = await getBlogArticles(3);
  const { homeContent } = content;

  return (
    <SiteShell content={content}>
      <main className="home-page">
        <section
          className="hero-section"
          style={{ '--hero-image': 'url(/images/homehero.jpg)' } as CSSProperties}
        >
          <div className="hero-copy">
            <p className="eyebrow">{homeContent.hero.eyebrow}</p>
            <h1>{homeContent.hero.title}</h1>
            <p>{homeContent.hero.copy}</p>
            <div className="hero-service-chips" aria-label="Core lending services">
              {homeContent.hero.serviceChips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <div className="hero-proof-list" aria-label="EmpowerFin lending support">
              {homeContent.hero.proofList.map((proof) => (
                <span key={proof}>{proof}</span>
              ))}
            </div>
            <div className="hero-actions">
              <Link className="primary-button" href="/contact">
                {homeContent.loanAssessment.cta}
              </Link>
              <Link className="secondary-button" href="/calculators">
                {homeContent.hero.calculatorCta}
              </Link>
            </div>
          </div>
          <LoanAssessmentPanel content={content} />
        </section>
        <QuickActionBand content={content} />
        <StatsBand content={content} />
        <BrokerProofSection content={content} />
        <ServicePreview content={content} />
        <TrustSection content={content} />
        <ProcessSection content={content} />
        <TestimonialsSection content={content} />
        <InsightsSection articles={blogArticles} content={content} />
        <CtaSection content={content} />
      </main>
    </SiteShell>
  );
}

export function PageHero({ eyebrow, title, copy, image }: PageHeroProps) {
  return (
    <section
      className={image ? 'page-hero page-hero-with-image' : 'page-hero'}
      style={image ? ({ '--page-hero-image': `url(${image})` } as CSSProperties) : undefined}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{copy}</p>
    </section>
  );
}

export function LoanAssessmentPanel({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { homeContent } = content;

  return (
    <div className="loan-assessment-panel">
      <div className="assessment-card">
        <span>{homeContent.loanAssessment.eyebrow}</span>
        <h2>{homeContent.loanAssessment.title}</h2>
        <ul>
          {homeContent.loanAssessment.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link className="primary-button assessment-cta" href="/contact">
          {homeContent.loanAssessment.cta}
        </Link>
      </div>
      <div className="lender-card">
        <strong>{homeContent.loanAssessment.stat}</strong>
        <span>{homeContent.loanAssessment.statLabel}</span>
      </div>
    </div>
  );
}

export function QuickActionBand({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { homeContent } = content;

  return (
    <section className="quick-action-band" aria-label="Quick finance actions">
      {homeContent.quickActions.map((action) => (
        <Link href={action.href} key={action.eyebrow}>
          <span>{action.eyebrow}</span>
          <strong>{action.title}</strong>
          <small>{action.cta}</small>
        </Link>
      ))}
    </section>
  );
}

export function StatsBand({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { proofPoints } = content;

  return (
    <section className="stats-band" aria-label="EmpowerFin proof points">
      {proofPoints.map((point) => (
        <div key={point.label}>
          <strong>{point.value}</strong>
          <span>{point.label}</span>
        </div>
      ))}
    </section>
  );
}

export function BrokerProofSection({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { homeContent } = content;

  return (
    <section className="broker-proof-band" aria-label="Finance broker service strengths">
      {homeContent.brokerProof.map((item) => (
        <div key={item.eyebrow}>
          <span>{item.eyebrow}</span>
          <strong>{item.title}</strong>
        </div>
      ))}
    </section>
  );
}

export function TrustSection({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { consultant, sectionContent } = content;

  return (
    <section className="split-section trust-section">
      <div>
        <p className="eyebrow">{sectionContent.trust.eyebrow}</p>
        <h2>{sectionContent.trust.title}</h2>
        <p>{sectionContent.trust.copy}</p>
      </div>
      <div className="advisor-card">
        <Image src={consultant.portrait} alt={consultant.name} width={488} height={635} sizes="180px" />
        <div>
          <span>{consultant.title}</span>
          <h3>{consultant.name}</h3>
          <p>{sectionContent.trust.advisorCopy}</p>
        </div>
      </div>
    </section>
  );
}

export function ServicePreview({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { sectionContent, services } = content;

  return (
    <section className="section-block services-section">
      <div className="section-heading">
        <p className="eyebrow">{sectionContent.services.eyebrow}</p>
        <h2>{sectionContent.services.title}</h2>
        <p>{sectionContent.services.copy}</p>
      </div>
      <div className="service-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <Image src={service.image} alt="" width={1024} height={680} sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw" />
            <span>{service.stat}</span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ProcessSection({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { processSteps, sectionContent } = content;

  return (
    <section className="section-block process-section">
      <div className="section-heading">
        <p className="eyebrow">{sectionContent.process.eyebrow}</p>
        <h2>{sectionContent.process.title}</h2>
      </div>
      <div className="process-grid">
        {processSteps.map((step, index) => (
          <article key={step.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { sectionContent, testimonials } = content;

  return (
    <section className="section-block">
      <div className="section-heading">
        <p className="eyebrow">{sectionContent.testimonials.eyebrow}</p>
        <h2>{sectionContent.testimonials.title}</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name}>
            <div className="testimonial-rating" aria-label="5 star rating">
              <span aria-hidden="true">★★★★★</span>
            </div>
            <blockquote>{testimonial.quote}</blockquote>
            <figcaption>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.context}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function InsightsSection({
  articles,
  content = defaultSiteContent,
}: {
  articles: BlogArticle[];
  content?: SiteContent;
}) {
  const { sectionContent } = content;

  return (
    <section className="section-block">
      <div className="section-heading with-link">
        <div>
          <p className="eyebrow">{sectionContent.insights.eyebrow}</p>
          <h2>{sectionContent.insights.title}</h2>
        </div>
      </div>
      <div className="article-grid">
        {articles.slice(0, 3).map((article) => (
          <article className="blog-card" key={article.title}>
            <Image
              className="blog-card-image"
              src={article.image}
              alt=""
              width={1024}
              height={640}
              sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
            />
            <div className="blog-card-body">
              <span>{article.date ? `${article.category} / ${article.date}` : article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <Link className="blog-card-link" href={article.href}>
                Read article
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="section-action">
        <Link className="text-link" href="/knowledge-hub">
          {sectionContent.insights.cta}
        </Link>
      </div>
    </section>
  );
}

export function CtaSection({ content = defaultSiteContent }: { content?: SiteContent }) {
  const { ctaContent } = content;

  return (
    <section className="cta-section">
      <Image src={ctaContent.image} alt="" width={1024} height={656} sizes="(max-width: 980px) 100vw, 220px" />
      <div>
        <p className="eyebrow">{ctaContent.eyebrow}</p>
        <h2>{ctaContent.title}</h2>
        <p>{ctaContent.copy}</p>
      </div>
      <Link className="primary-button" href="/contact">
        {ctaContent.cta}
      </Link>
    </section>
  );
}

export async function AboutPage() {
  const content = await getSiteContent();
  const { consultant, pageHeroes, sectionContent, values } = content;

  return (
    <SiteShell content={content}>
      <main className="about-page">
        <PageHero
          eyebrow={pageHeroes.about.eyebrow}
          title={pageHeroes.about.title}
          copy={pageHeroes.about.copy}
          image={pageHeroes.about.image}
        />
        <section className="split-section about-intro-section">
          <div>
            <p className="eyebrow">{sectionContent.aboutIntro.eyebrow}</p>
            <h2>{sectionContent.aboutIntro.title}</h2>
            <p>
              {consultant.bio} {sectionContent.aboutIntro.copy}
            </p>
            <p>{sectionContent.aboutIntro.secondCopy}</p>
          </div>
          <div className="profile-card">
            <Image src={consultant.portrait} alt={consultant.name} width={488} height={635} sizes="260px" />
            <h3>{consultant.name}</h3>
            <p>{consultant.title}</p>
          </div>
        </section>
        <section className="section-block about-values-section">
          <div className="section-heading">
            <p className="eyebrow">{sectionContent.values.eyebrow}</p>
            <h2>{sectionContent.values.title}</h2>
          </div>
          <div className="value-grid">
            {values.map((value) => (
              <article key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </section>
        <CtaSection content={content} />
      </main>
    </SiteShell>
  );
}

export async function ServicesPage() {
  const content = await getSiteContent();
  const { pageHeroes } = content;

  return (
    <SiteShell content={content}>
      <main className="services-page">
        <PageHero
          eyebrow={pageHeroes.services.eyebrow}
          title={pageHeroes.services.title}
          copy={pageHeroes.services.copy}
          image={pageHeroes.services.image}
        />
        <ServicePreview content={content} />
        <ProcessSection content={content} />
        <CtaSection content={content} />
      </main>
    </SiteShell>
  );
}

export async function KnowledgeHubPage() {
  const content = await getSiteContent();
  const { pageHeroes } = content;
  const blogArticles = await getBlogArticles(12);

  return (
    <SiteShell content={content}>
      <main>
        <PageHero
          eyebrow={pageHeroes.knowledgeHub.eyebrow}
          title={pageHeroes.knowledgeHub.title}
          copy={pageHeroes.knowledgeHub.copy}
          image={pageHeroes.knowledgeHub.image}
        />
        <section className="section-block">
          <div className="article-grid large">
            {blogArticles.map((article) => (
              <article className="blog-card" key={article.title}>
                <Image
                  className="blog-card-image"
                  src={article.image}
                  alt=""
                  width={1024}
                  height={640}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="blog-card-body">
                  <span>{article.date ? `${article.category} / ${article.date}` : article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link className="blog-card-link" href={article.href}>
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </SiteShell>
  );
}

export async function TestimonialsPage() {
  const content = await getSiteContent();
  const { pageHeroes } = content;

  return (
    <SiteShell content={content}>
      <main>
        <PageHero
          eyebrow={pageHeroes.testimonials.eyebrow}
          title={pageHeroes.testimonials.title}
          copy={pageHeroes.testimonials.copy}
          image={pageHeroes.testimonials.image}
        />
        <TestimonialsSection content={content} />
        <CtaSection content={content} />
      </main>
    </SiteShell>
  );
}

export async function CalculatorsPage() {
  const content = await getSiteContent();
  const { calculatorEmbeds, pageHeroes } = content;

  return (
    <SiteShell content={content}>
      <main>
        <PageHero
          eyebrow={pageHeroes.calculators.eyebrow}
          title={pageHeroes.calculators.title}
          copy={pageHeroes.calculators.copy}
          image={pageHeroes.calculators.image}
        />
        <section className="calculator-embed-section">
          {calculatorEmbeds.map((calculator, index) => (
            <details className="calculator-embed-panel" key={calculator.title} open={index === 0}>
              <summary>
                <span>{calculator.title}</span>
                <strong>+</strong>
              </summary>
              <iframe
                className="calculator-embed"
                src={calculator.src}
                title={`${calculator.title} calculator`}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </details>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}

export async function ContactPage() {
  const content = await getSiteContent();
  const { contact, pageHeroes } = content;

  return (
    <SiteShell content={content}>
      <main>
        <PageHero
          eyebrow={pageHeroes.contact.eyebrow}
          title={pageHeroes.contact.title}
          copy={pageHeroes.contact.copy}
          image={pageHeroes.contact.image}
        />
        <section className="contact-section">
          <div className="contact-panel">
            <div className="contact-panel-heading">
              <span>Contact details</span>
              <h2>Speak with EmpowerFin</h2>
            </div>
            <dl className="contact-detail-list">
              <div>
                <dt>Address</dt>
                <dd>{contact.address}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <Link href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</Link>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <Link href={`mailto:${contact.email}`}>{contact.email}</Link>
                </dd>
              </div>
            </dl>
          </div>
          <ContactForm content={content.contactFormContent} />
          <div className="contact-map-panel">
            <div className="contact-map-heading">
              <span>Location</span>
              <h2>Visit or locate EmpowerFin</h2>
              <Link href={contact.mapUrl} target="_blank" rel="noreferrer">
                Open in Google Maps
              </Link>
            </div>
            <iframe
              className="contact-map"
              src={contact.mapEmbedUrl}
              title="EmpowerFin location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
