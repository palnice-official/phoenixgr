import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';
type MenuItemData = {
  id: string;
  title: string;
  url?: string | null;
  items?: readonly MenuItemData[];
};

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const logo = shop.brand?.logo?.image;

  return (
    <header className="header">
      <HeaderMenuMobileToggle />

      <NavLink
        aria-label={shop.name}
        className="header-logo"
        end
        prefetch="intent"
        to="/"
      >
        {logo?.url ? (
          <img
            src={logo.url}
            alt={logo.altText || shop.name}
            width={logo.width || undefined}
            height={logo.height || undefined}
          />
        ) : (
          <strong>{shop.name}</strong>
        )}
      </NavLink>

      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();
  const items: readonly MenuItemData[] = menu?.items?.length
    ? menu.items
    : FALLBACK_HEADER_MENU.items;

  return (
    <nav
      aria-label={viewport === 'desktop' ? 'Hauptnavigation' : 'Mobiles Menü'}
      className={`header-menu-${viewport}`}
    >
      {items.map((item) =>
        viewport === 'mobile' ? (
          <MobileMenuItem
            item={item}
            key={item.id}
            close={close}
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
          />
        ) : (
          <DesktopMenuItem
            item={item}
            key={item.id}
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
          />
        ),
      )}
    </nav>
  );
}

function DesktopMenuItem({
  item,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  item: MenuItemData;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const children = item.items || [];
  if (!item.url) return null;

  return (
    <div className="header-menu-group">
      <MenuLink
        className="header-menu-item"
        item={item}
        primaryDomainUrl={primaryDomainUrl}
        publicStoreDomain={publicStoreDomain}
      />
      {!!children.length && (
        <>
          <ChevronDown />
          <div className="header-submenu">
            {children.map((child) =>
              child.url ? (
                <MenuLink
                  className="header-submenu-item"
                  item={child}
                  key={child.id}
                  primaryDomainUrl={primaryDomainUrl}
                  publicStoreDomain={publicStoreDomain}
                />
              ) : null,
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MobileMenuItem({
  item,
  close,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  item: MenuItemData;
  close: () => void;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const children = item.items || [];
  const childrenId = `mobile-menu-${item.id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  if (!item.url) return null;

  return (
    <div className="header-mobile-menu-item">
      <div className="header-mobile-item-row">
        <MenuLink
          className="header-mobile-link"
          item={item}
          onClick={close}
          primaryDomainUrl={primaryDomainUrl}
          publicStoreDomain={publicStoreDomain}
        />
        {!!children.length && (
          <button
            type="button"
            aria-controls={childrenId}
            aria-expanded={expanded}
            aria-label={`${item.title} Untermenü ${expanded ? 'schließen' : 'öffnen'}`}
            onClick={() => setExpanded((open) => !open)}
          >
            <ChevronDown />
          </button>
        )}
      </div>
      {!!children.length && (
        <div
          className="header-mobile-submenu"
          hidden={!expanded}
          id={childrenId}
        >
          {children.map((child) =>
            child.url ? (
              <MenuLink
                className="header-mobile-sublink"
                item={child}
                key={child.id}
                onClick={close}
                primaryDomainUrl={primaryDomainUrl}
                publicStoreDomain={publicStoreDomain}
              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

function MenuLink({
  className,
  item,
  onClick,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  className: string;
  item: MenuItemData;
  onClick?: () => void;
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  return (
    <NavLink
      className={({isActive, isPending}) =>
        `${className}${isActive ? ' active' : ''}${isPending ? ' pending' : ''}`
      }
      end
      onClick={onClick}
      prefetch="intent"
      to={menuUrl(item.url || '/', primaryDomainUrl, publicStoreDomain)}
    >
      {item.title}
    </NavLink>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav aria-label="Konto, Suche und Warenkorb" className="header-ctas">
      <NavLink className="header-icon-button" prefetch="intent" to="/account">
        <AccountIcon />
        <span className="sr-only">
          <Suspense fallback="Anmelden">
            <Await resolve={isLoggedIn} errorElement="Anmelden">
              {(loggedIn) => (loggedIn ? 'Konto' : 'Anmelden')}
            </Await>
          </Suspense>
        </span>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open, type} = useAside();
  return (
    <button
      type="button"
      aria-controls="mobile-navigation"
      aria-expanded={type === 'mobile'}
      aria-label="Menü öffnen"
      className="header-menu-mobile-toggle"
      onClick={() => open('mobile')}
    >
      <span />
      <span />
      <span />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      aria-label="Suche öffnen"
      className="header-icon-button"
      onClick={() => open('search')}
    >
      <SearchIcon />
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      aria-label={`Warenkorb, ${count} Artikel`}
      className="header-icon-button header-cart"
      href="/cart"
      onClick={(event) => {
        event.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <CartIcon />
      {count > 0 && <span className="header-cart-count">{count}</span>}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function menuUrl(
  url: string,
  primaryDomainUrl: string,
  publicStoreDomain: string,
) {
  if (url.startsWith('/')) return url;
  if (url.includes(publicStoreDomain) || url.includes(primaryDomainUrl)) {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  }
  return url;
}

function AccountIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="10.75" cy="10.75" r="6.75" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M2.5 4h2l2 11.5h11.75l2-8.5H5" />
      <circle cx="8.5" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg aria-hidden="true" className="header-chevron" viewBox="0 0 12 8">
      <path d="m1 1.5 5 5 5-5" />
    </svg>
  );
}

const FALLBACK_HEADER_MENU = {
  items: [
    {
      id: 'all-products',
      title: 'Alle Produkte',
      url: '/collections',
      items: [],
    },
    {id: 'reviews', title: 'Bewertungen', url: '/pages/bewertungen', items: []},
    {id: 'faq', title: 'FAQ', url: '/pages/faq', items: []},
    {id: 'about', title: 'Über uns', url: '/pages/ueber-uns', items: []},
  ],
};
