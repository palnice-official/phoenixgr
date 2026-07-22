import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {Link} from 'react-router';
import {t} from '~/lib/t';

export function ProductPrice({
  price,
  compareAtPrice,
  size = 'default',
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  size?: 'default' | 'large';
}) {
  const discountPercent =
    price && compareAtPrice
      ? Math.round(
          ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
            parseFloat(compareAtPrice.amount)) *
            100,
        )
      : 0;

  return (
    <div className={`product-price-block ${size}`} role="group" aria-label="Preis">
      <div className="product-price-row">
        {compareAtPrice ? (
          <div className="product-price-on-sale">
            {price ? <Money data={price} /> : null}
            <s>
              <Money data={compareAtPrice} />
            </s>
            {discountPercent > 0 && (
              <span className="product-discount-badge">
                {t.price.discountBadge(discountPercent)}
              </span>
            )}
          </div>
        ) : price ? (
          <Money data={price} />
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
      <p className="product-price-tax-note">
        {t.price.taxNote}{' '}
        <Link to={t.price.shippingPagePath}>{t.price.taxNoteShippingWord}</Link>
      </p>
    </div>
  );
}
