import {useEffect, useState} from 'react';
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {t} from '~/lib/t';

interface StickyMobileBuyBarProps {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  isAvailable: boolean;
  onAddToCart: () => void;
}

export function StickyMobileBuyBar({
  price,
  compareAtPrice,
  isAvailable,
  onAddToCart,
}: StickyMobileBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight);
    update();
    window.addEventListener('scroll', update, {passive: true});
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      className={`sticky-buy-bar ${visible ? 'visible' : ''}`}
      role="complementary"
      aria-label="Produkt kaufen"
    >
      <div className="sticky-buy-bar-inner">
        <div className="sticky-buy-bar-price">
          {price && <Money data={price} />}
          {compareAtPrice && (
            <s>
              <Money data={compareAtPrice} />
            </s>
          )}
          <small>
            {t.price.taxNote} {t.price.taxNoteShippingWord}
          </small>
        </div>
        <button
          type="button"
          className="sticky-buy-bar-cta"
          disabled={!isAvailable}
          onClick={onAddToCart}
        >
          {isAvailable ? t.product.stickyBar.cta : t.product.soldOut}
        </button>
      </div>
    </div>
  );
}
