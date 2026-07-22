import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {t} from '~/lib/t';
import {useState} from 'react';
import {ProductPrice} from './ProductPrice';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <div className="product-form">
      {productOptions.map((option, optionIndex) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <label className="product-options-label">
              <span className="product-option-step">{optionIndex + 1}</span>
              {option.name}
              <span className="product-options-selected">
                {option.optionValues.find((v) => v.selected)?.name}
              </span>
            </label>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`product-options-item ${selected ? 'selected' : ''}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={`product-options-item ${selected ? 'selected' : ''} ${
                      exists && !selected ? 'link' : ''
                    }`}
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <ProductPrice
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
        size="large"
      />

      {/* Quantity */}
      <div className="product-quantity">
        <label htmlFor="quantity" className="product-quantity-label">
          {t.product.quantity}:
        </label>
        <div className="product-quantity-stepper">
          <button
            type="button"
            aria-label={t.product.quantity}
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            &#8722;
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
          />
          <button
            type="button"
            aria-label={t.product.quantity}
            onClick={() => setQuantity((q) => q + 1)}
          >
            &#43;
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <AddToCartButton
        disabled={!isAvailable}
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {isAvailable ? t.product.addToCart : t.product.soldOut}
      </AddToCartButton>

      {/* Trust checkmarks */}
      <ul className="product-trust-list">
        <li>
          <CheckIcon />
          {t.product.trust.freeShipping}
        </li>
        <li>
          <CheckIcon />
          {t.product.trust.moneyBack}
        </li>
        <li>
          <CheckIcon />
          {t.product.trust.certified}
        </li>
        <li>
          <CheckIcon />
          {t.product.trust.support}
        </li>
      </ul>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span>{name}</span>;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
