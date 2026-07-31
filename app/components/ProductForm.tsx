import {Link} from 'react-router';
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


const OPTION_IMAGES = [
  ['family-1.svg', 'family-3.svg', 'family-5.svg'],
  ['carbon2.png', 'stainless2.png'],
  ['no_stand.png', 'stand_ss.png', 'stand_wooden.png'],
].map((images) => images.map((image) => '/images/product-options/' + image));

export function ProductForm({
  productOptions,
  selectedVariant,
  selectedSellingPlanId = null,
  onSellingPlanChange,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  selectedSellingPlanId?: string | null;
  onSellingPlanChange?: (sellingPlanId: string | null) => void;
}) {
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const isAvailable = selectedVariant?.availableForSale ?? false;
  const sellingPlans = selectedVariant?.sellingPlanAllocations.nodes ?? [];
  const selectedAllocation =
    sellingPlans.find(
      ({sellingPlan}) => sellingPlan.id === selectedSellingPlanId,
    ) ?? null;

  return (
    <div className="product-form">
      {productOptions.map((option, optionIndex) => {
        if (option.optionValues.length === 1) return null;

        const optionImages = OPTION_IMAGES[optionIndex];
        const layout = optionIndex === 0 ? 'cards' : 'visual';

        return (
          <div
            className={[
              'product-options',
              optionImages ? 'product-options--' + layout : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={option.name}
          >
            <label className="product-options-label">
              <span className="product-option-step">{optionIndex + 1}</span>
              {option.name}
              <span className="product-options-selected">
                {' - '}
                {option.optionValues.find((v) => v.selected)?.name}
              </span>
            </label>
            <div className="product-options-grid">
              {option.optionValues.map((value, valueIndex) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
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
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={name}
                        localImage={optionImages?.[valueIndex]}
                      />
                    </Link>
                  );
                }

                if (!exists) {
                  return (
                    <button
                      type="button"
                      className="product-options-item"
                      key={option.name + name}
                      disabled
                    >
                      <ProductOptionSwatch
                        swatch={swatch}
                        name={name}
                        localImage={optionImages?.[valueIndex]}
                      />
                    </button>
                  );
                }

                return (
                  <Link
                    className={`product-options-item ${selected ? 'selected' : ''} ${
                      exists && !selected ? 'link' : ''
                    }`}
                    key={option.name + name}
                    prefetch="intent"
                    preventScrollReset
                    replace
                    to={`?${variantUriQuery}`}
                  >
                    <ProductOptionSwatch
                      swatch={swatch}
                      name={name}
                      localImage={optionImages?.[valueIndex]}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="product-price-status">
        <ProductPrice
          price={
            selectedAllocation?.priceAdjustments[0]?.price ??
            selectedVariant?.price
          }
          compareAtPrice={
            selectedAllocation?.priceAdjustments[0]?.compareAtPrice ??
            selectedVariant?.compareAtPrice
          }
          size="large"
        />
        <p className={`product-stock-status ${isAvailable ? 'in-stock' : ''}`}>
          {isAvailable ? 'Auf Lager' : t.product.soldOut}
        </p>
      </div>

      {!!sellingPlans.length && onSellingPlanChange && (
        <fieldset className="product-purchase-options">
          <legend>{t.product.purchaseOptions.heading}</legend>
          <label
            aria-label="Einmaliger Kauf"
            htmlFor="purchase-option-once"
            className={`product-purchase-option ${!selectedSellingPlanId ? 'selected' : ''}`}
          >
            <input
              id="purchase-option-once"
              type="radio"
              name="purchase-option"
              checked={!selectedSellingPlanId}
              onChange={() => onSellingPlanChange(null)}
            />
            <span>
              <strong>Einmaliger Kauf</strong>
              <small>Keine wiederkehrende Lieferung</small>
            </span>
          </label>
          {sellingPlans.map(({sellingPlan}) => (
            <label
              aria-label={sellingPlan.name}
              htmlFor={`purchase-option-${sellingPlan.id}`}
              className={`product-purchase-option ${
                selectedSellingPlanId === sellingPlan.id ? 'selected' : ''
              }`}
              key={sellingPlan.id}
            >
              <input
                id={`purchase-option-${sellingPlan.id}`}
                type="radio"
                name="purchase-option"
                checked={selectedSellingPlanId === sellingPlan.id}
                onChange={() => onSellingPlanChange(sellingPlan.id)}
              />
              <span>
                <strong>{sellingPlan.name}</strong>
                {sellingPlan.description && (
                  <small>{sellingPlan.description}</small>
                )}
                <small>{t.product.purchaseOptions.note}</small>
              </span>
            </label>
          ))}
        </fieldset>
      )}


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
                  sellingPlanId: selectedSellingPlanId || undefined,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {isAvailable ? t.product.addToCart : t.product.soldOut}
      </AddToCartButton>

      <p className="product-shipping-note">{t.product.shippingEstimate}</p>
      <ul className="product-payment-list" aria-label="Zahlungsarten">
        <li>Visa</li>
        <li>Mastercard</li>
        <li>PayPal</li>
        <li>Klarna</li>
      </ul>

      {/* Trust checkmarks */}
      <ul className="product-trust-list">
        <li>
          <img
            className="product-trust-icon"
            src="/images/product-options/icon-truck.png"
            alt=""
          />
          {t.product.trust.freeShipping}
        </li>
        <li>
          <img
            className="product-trust-icon"
            src="/images/product-options/icon-tag.png"
            alt=""
          />
          {t.product.trust.moneyBack}
        </li>
        <li>
          <img
            className="product-trust-icon"
            src="/images/product-options/icon-award.png"
            alt=""
          />
          {t.product.trust.certified}
        </li>
        <li>
          <img
            className="product-trust-icon"
            src="/images/product-options/icon-headset.png"
            alt=""
          />
          {t.product.trust.support}
        </li>
        <li>
          <img
            className="product-trust-icon"
            src="/images/product-options/icon-award.png"
            alt=""
          />
          10 Jahre Garantie
        </li>
      </ul>
    </div>
  );
}


function ProductOptionSwatch({
  swatch,
  name,
  localImage,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
  localImage?: string;
}) {
  const image = localImage || swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  const sizeMatch = name.match(/^(\d+\s*Liter)\s+(.+)$/i);

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
      <span>
        {sizeMatch ? (
          <>
            <small>{sizeMatch[2]}</small>
            <strong>{sizeMatch[1]}</strong>
          </>
        ) : (
          name
        )}
      </span>
    </div>
  );
}
