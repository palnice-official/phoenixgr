import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {config} from '~/lib/config';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-brand">
              <strong>Phoenix</strong>
              <p>Reines Wasser. Natürlich.</p>
              <a href={`mailto:${config.contactEmail}`}>{config.contactEmail}</a>
              <a href={`tel:${config.contactPhone.replace(/\s/g, '')}`}>
                {config.contactPhone}
              </a>
            </div>
            {header.shop.primaryDomain?.url && (
              <div className="footer-menus">
                <FooterMenu
                  menu={footer?.menu ?? null}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
                <FooterMenu
                  menu={footer?.secondMenu ?? null}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </div>
            )}
            <small>© {new Date().getFullYear()} Phoenix Water Filters</small>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'] | FooterQuery['secondMenu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'fallback-footer',
  items: [
    {
      id: 'impressum',
      resourceId: null,
      tags: [],
      title: 'Impressum',
      type: 'PAGE',
      url: '/pages/impressum',
      items: [],
    },
    {
      id: 'widerruf',
      resourceId: null,
      tags: [],
      title: 'Widerrufsbelehrung',
      type: 'PAGE',
      url: '/pages/widerrufsbelehrung',
      items: [],
    },
    {
      id: 'datenschutz',
      resourceId: null,
      tags: [],
      title: 'Datenschutzerklärung',
      type: 'PAGE',
      url: '/pages/datenschutzerklaerung',
      items: [],
    },
    {
      id: 'agb',
      resourceId: null,
      tags: [],
      title: 'AGB',
      type: 'PAGE',
      url: '/pages/agb',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
