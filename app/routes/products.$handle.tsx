import {redirect, useLoaderData, useFetcher} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Money,
} from '@shopify/hydrogen';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {ProductAccordion} from '~/components/ProductAccordion';
import {StickyMobileBuyBar} from '~/components/StickyMobileBuyBar';
import {FeatureSplit} from '~/components/FeatureSplit';
import {FeatureGrid} from '~/components/FeatureGrid';
import {ComparisonTable} from '~/components/ComparisonTable';
import {ThreeSteps} from '~/components/ThreeSteps';
import {GuaranteeSection} from '~/components/GuaranteeSection';
import {FinalCTA} from '~/components/FinalCTA';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {t} from '~/lib/t';
import {config} from '~/lib/config';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) return [{title: 'Produkt nicht gefunden'}];

  const price = product.selectedOrFirstAvailableVariant?.price;
  const currency = price?.currencyCode || 'EUR';

  return [
    {title: `${product.seo?.title || product.title} | Phoenix`},
    {
      name: 'description',
      content:
        product.seo?.description || product.description?.slice(0, 160) || '',
    },
    {property: 'og:title', content: product.seo?.title || product.title},
    {
      property: 'og:description',
      content:
        product.seo?.description || product.description?.slice(0, 160) || '',
    },
    {
      property: 'og:image',
      content:
        product.selectedOrFirstAvailableVariant?.image?.url ||
        product.images?.nodes?.[0]?.url ||
        '',
    },
    {
      property: 'og:type',
      content: 'product',
    },
    {
      property: 'product:price:amount',
      content: price?.amount || '',
    },
    {
      property: 'product:price:currency',
      content: currency,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;
  const images = product.images?.nodes ?? [];
  const isAvailable = selectedVariant?.availableForSale ?? false;

  const accordionItems = [
    {title: t.product.accordions.description, content: descriptionHtml || ''},
    {
      title: t.product.accordions.contents,
      content:
        '<p>Hochwertige Edelstahl-Filteranlage inkl. Kerzenfiltersatz.</p>',
    },
    {
      title: t.product.accordions.shipping,
      content:
        '<p>Kostenloser Versand innerhalb Deutschlands. Lieferzeit: 3-5 Werktage.</p>',
    },
    {
      title: t.product.accordions.faq,
      content:
        '<p>Bei Fragen kontaktieren Sie uns bitte unter support@example.de</p>',
    },
  ].filter((item) => item.content);

  // JSON-LD Product structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: product.description || '',
    image: images.map((img: {url: string}) => img.url),
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'Phoenix',
    },
    sku: selectedVariant?.sku || '',
    offers: {
      '@type': 'Offer',
      url: `/products/${product.handle}`,
      priceCurrency: selectedVariant?.price?.currencyCode || 'EUR',
      price: selectedVariant?.price?.amount || '0',
      availability: isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      <section className="product-page">
        {/* Gallery */}
        <ProductImage
          image={selectedVariant?.image}
          images={images.length > 0 ? images : undefined}
        />

        {/* Buy box */}
        <div className="product-buybox">
          <p className="product-sale-label">FRÜHLINGSANGEBOT</p>
          <h1 className="product-title">{title}</h1>

          {/* Rating link */}
          <a href="#reviews" className="product-rating-link">
            <StarRating />
            <span>{t.product.rating(935)}</span>
          </a>

          {descriptionHtml && (
            <div
              className="product-intro"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          )}

          {/* Form */}
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />

          {/* Accordions */}
          <ProductAccordion items={accordionItems} />
        </div>

        {/* Analytics */}
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: selectedVariant?.price.amount || '0',
                vendor: product.vendor,
                variantId: selectedVariant?.id || '',
                variantTitle: selectedVariant?.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </section>

      <section
        className="product-removes"
        aria-labelledby="product-removes-title"
      >
        <div className="product-removes-inner">
          <h2 id="product-removes-title">Unsere Filter entfernen …</h2>
          <div className="product-removes-grid">
            {[
              'Schwermetalle',
              'PFAS',
              'Mikroplastik',
              'Chlor',
              'Bakterien',
              'Pestizide',
            ].map((item) => (
              <div key={item} className="product-removes-item">
                <span aria-hidden="true">✓</span>
                <strong>{item}</strong>
                <small>bis zu 99,9 %</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Nanobakterien-Filtration"
        body="Aktivkohle aus natürlichen Kokosnussschalen bindet Chemikalien, Giftstoffe und Schwermetalle. Spezielle Adsorbentien hemmen zugleich das Wachstum von Verunreinigungen im Filter – Mineralien und Sauerstoff bleiben im Wasser erhalten."
        imageSrc={images[1]?.url || images[0]?.url}
        imageAlt="Phoenix Schwerkraft-Wasserfilter"
      />
      <FeatureSplit
        imageSide="left"
        heading="Für viele Jahre gebaut"
        body="Lebensmittelechter Edelstahl AISI 304 ersetzt Kunststoff, benötigt weder Strom noch Wasseranschluss und macht das System robust, mobil und besonders einfach zu warten."
        imageSrc={images[2]?.url || images[0]?.url}
        imageAlt="Phoenix Wasserfilter aus Edelstahl"
      />
      <FeatureGrid />
      <ComparisonTable
        rows={[
          {
            label: 'Erschwinglich',
            phoenix: true,
            other_systems: false,
            bottled: false,
            pitchers: true,
          },
          {
            label: 'Tragbar',
            phoenix: true,
            other_systems: false,
            bottled: true,
            pitchers: true,
          },
          {
            label: 'Langlebiger Edelstahl',
            phoenix: true,
            other_systems: false,
            bottled: false,
            pitchers: false,
          },
          {
            label: '100 Tage risikofrei testen',
            phoenix: true,
            other_systems: false,
            bottled: false,
            pitchers: false,
          },
          {
            label: 'Kein Wasseranschluss nötig',
            phoenix: true,
            other_systems: false,
            bottled: true,
            pitchers: true,
          },
        ]}
      />
      <ThreeSteps
        steps={[
          {
            icon: '',
            title: 'Aufstellen',
            body: 'Das System zusammensetzen und die Filter einsetzen.',
            order: 1,
          },
          {
            icon: '',
            title: 'Befüllen',
            body: 'Leitungs-, Brunnen- oder Quellwasser oben einfüllen.',
            order: 2,
          },
          {
            icon: '',
            title: 'Genießen',
            body: 'Sauberes, wohlschmeckendes Wasser direkt zapfen.',
            order: 3,
          },
        ]}
      />
      <GuaranteeSection imageUrl={images[3]?.url || images[0]?.url} />
      <FinalCTA imageUrl={images[4]?.url || images[0]?.url} />

      {/* Sticky mobile buy bar */}
      <StickyMobileBuyBar
        price={selectedVariant?.price}
        compareAtPrice={selectedVariant?.compareAtPrice}
        isAvailable={isAvailable}
        onAddToCart={() => {
          if (!selectedVariant) return;
          void fetcher.submit(
            {
              lines: JSON.stringify([
                {merchandiseId: selectedVariant.id, quantity: 1},
              ]),
              intent: 'LinesAdd',
            },
            {method: 'POST', action: '/cart'},
          );
        }}
      />
    </>
  );
}

function StarRating() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
