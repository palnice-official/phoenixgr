import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

function FooterMenu({
  fallback,
  heading,
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  fallback: typeof HOME_MENU;
  heading: string;
  menu: FooterQuery['menu'] | FooterQuery['secondMenu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const items = menu?.items.length ? menu.items : fallback.items;
  return (
    <nav aria-label={heading} className="footer-menu">
      <h2>{heading}</h2>
      {items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return url.startsWith('/') ? (
          <NavLink key={item.id} prefetch="intent" to={url}>
            {item.title}
          </NavLink>
        ) : (
          <a href={url} key={item.id} rel="noreferrer" target="_blank">
            {item.title}
          </a>
        );
      })}
    </nav>
  );
}

function ContactDetail({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="footer-contact-detail">
      <span className="footer-contact-icon">{icon}</span>
      <div>
        <strong>{label}</strong>
        <a href={href}>{value}</a>
      </div>
    </div>
  );
}

const HOME_MENU = {
  items: [
    {id: 'shop', title: 'Alle Produkte', url: '/collections/all'},
    {
      id: 'system',
      title: 'Das komplette System',
      url: '/products/le-filtre-a-eau-par-gravite-phoenix-test',
    },
    {id: 'how', title: 'So funktioniert es', url: '/pages/how-it-works'},
    {id: 'setup', title: 'Filter einrichten', url: '/pages/set-up-your-filter'},
    {id: 'blog', title: 'Blog', url: '/blogs/post'},
    {
      id: 'warranty',
      title: 'Garantie registrieren',
      url: '/pages/warranty-registration',
    },
    {
      id: 'ambassador',
      title: 'Botschafter werden',
      url: 'https://af.uppromote.com/phoenix-water-filters/register',
    },
  ],
};

const HELPFUL_MENU: typeof HOME_MENU = {
  items: [
    {id: 'about', title: '\u00dcber uns', url: '/pages/about-us'},
    {id: 'contact', title: 'Kontakt', url: '/pages/contact-us'},
    {id: 'faq', title: 'FAQ', url: '/pages/faqs'},
    {id: 'shipping', title: 'Versand', url: '/policies/shipping-policy'},
    {id: 'privacy', title: 'Datenschutz', url: '/policies/privacy-policy'},
    {id: 'returns', title: 'R\u00fcckgabe', url: '/policies/refund-policy'},
    {
      id: 'terms',
      title: 'Garantie',
      url: '/policies/terms-of-service',
    },
  ],
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 16">
      <path d="M1 8h20m-6-6 6 6-6 6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3 5h18v14H3zM3 6l9 7 9-7" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M21 12c0 4-.5 5.5-1.2 6.2S17 19 12 19s-7.1-.1-7.8-.8S3 16 3 12s.5-5.5 1.2-6.2S7 5 12 5s7.1.1 7.8.8S21 8 21 12Z" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  const logo = header.shop.brand?.logo?.image ?? {
    url: '/images/product-options/phoenix-gravity-logo.png',
    altText: 'Phoenix Gravity',
    width: 352,
    height: 431,
  };
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-grid">
                <div className="footer-brand">
                  <NavLink aria-label="Phoenix Gravity Startseite" to="/">
                    {logo?.url ? (
                      <img
                        className="footer-logo"
                        src={logo.url}
                        alt={logo.altText || header.shop.name}
                        width={logo.width || undefined}
                        height={logo.height || undefined}
                      />
                    ) : (
                      <strong className="footer-wordmark">
                        Phoenix Gravity
                      </strong>
                    )}
                  </NavLink>
                  <p>
                    Schwerkraft-Wasserfilter aus Edelstahl: einfach aufstellen,
                    befüllen und frisches Wasser genießen.
                  </p>
                </div>
                <FooterMenu
                  heading="Startseite"
                  menu={footer?.menu ?? null}
                  fallback={HOME_MENU}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
                <FooterMenu
                  heading="Hilfreiche Links"
                  menu={footer?.secondMenu ?? null}
                  fallback={HELPFUL_MENU}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />

                <div className="footer-subscribe">
                  <h2>Newsletter abonnieren</h2>
                  <form action="/contact" method="post">
                    <label className="sr-only" htmlFor="footer-email">
                      E-Mail-Adresse
                    </label>
                    <input
                      id="footer-email"
                      name="contact[email]"
                      placeholder="E-Mail-Adresse eingeben"
                      required
                      type="email"
                    />
                    <button aria-label="Newsletter abonnieren" type="submit">
                      <ArrowIcon />
                    </button>
                  </form>
                  <nav
                    aria-label="Soziale Netzwerke"
                    className="footer-socials"
                  >
                    <a
                      aria-label="Facebook"
                      href="https://www.facebook.com/PhoenixGravity"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <FacebookIcon />
                    </a>
                    <a
                      aria-label="Instagram"
                      href="https://www.instagram.com/phoenixgravitywaterfilters"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <InstagramIcon />
                    </a>
                    <a
                      aria-label="YouTube"
                      href="https://www.youtube.com/@PhoenixWaterFiltersUSA"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <YoutubeIcon />
                    </a>
                  </nav>
                </div>
              </div>
              <section
                aria-labelledby="footer-contact-title"
                className="footer-contact"
              >
                <h2 id="footer-contact-title">
                  Noch Fragen? Schreiben Sie uns.
                </h2>
                <div className="footer-contact-grid">
                  <ContactDetail
                    href="mailto:hello@phoenixwaterfilters.com"
                    icon={<MailIcon />}
                    label="E-Mail-Adresse"
                    value="hello@phoenixwaterfilters.com"
                  />
                </div>
              </section>
            </div>
            <div className="footer-copyright">
              Copyright &copy; Phoenix Gravity {new Date().getFullYear()} | Alle
              Rechte vorbehalten
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
