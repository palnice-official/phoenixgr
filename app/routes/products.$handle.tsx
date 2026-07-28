import {
  redirect,
  useLoaderData,
  useFetcher,
  useSearchParams,
} from 'react-router';
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
import {ProductTemplateSections} from '~/components/ProductTemplateSections';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {t} from '~/lib/t';
import {config} from '~/lib/config';
import {getReviews, getReviewSummary} from '~/lib/reviews.server';

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

  const [{product}, reviews, reviewSummary] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions: getSelectedProductOptions(request),
      },
    }),
    getReviews(context.env, {perPage: 8}),
    getReviewSummary(context.env),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product, reviews, reviewSummary};
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product, reviews, reviewSummary} = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const variantImages =
    selectedVariant?.gallery?.references?.nodes.flatMap((reference) =>
      reference?.image ? [reference.image] : [],
    ) ?? [];
  const galleryImages = variantImages.length ? variantImages : images;
  const requestedSellingPlanId = searchParams.get('selling_plan');
  const selectedSellingPlan =
    selectedVariant?.sellingPlanAllocations.nodes.find(
      ({sellingPlan}) => sellingPlan.id === requestedSellingPlanId,
    ) ?? null;
  const selectSellingPlan = (sellingPlanId: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (sellingPlanId) next.set('selling_plan', sellingPlanId);
    else next.delete('selling_plan');
    setSearchParams(next, {replace: true, preventScrollReset: true});
  };

  const accordionItems = [
    {title: t.product.accordions.description, content: descriptionHtml || ''},
    {
      title: t.product.accordions.specifications,
      ...(selectedVariant?.specifications?.value
        ? {richText: selectedVariant.specifications.value}
        : {
            content:
              '<ul><li>Gehäuse aus lebensmittelechtem Edelstahl AISI 304</li><li>Betrieb ohne Strom und Festwasseranschluss</li><li>Größe, Filtertyp und Stand passend zur gewählten Variante</li></ul>',
          }),
    },
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
        '<p><strong>Benötigt das System Strom?</strong><br>Nein. Das Wasser wird ausschließlich durch Schwerkraft gefiltert.</p><p><strong>Welche Variante passt zu mir?</strong><br>Wählen Sie Größe, Filtertyp und Stand direkt oben aus. Preis und Verfügbarkeit werden automatisch aktualisiert.</p><p><strong>Kann ich den Filter testen?</strong><br>Ja, es gilt unsere 100-Tage-Geld-zurück-Garantie.</p>',
    },
  ].filter((item) => item.content || ('richText' in item && item.richText));

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
    ...(reviewSummary
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviewSummary.averageRating,
            reviewCount: reviewSummary.totalCount,
          },
        }
      : {}),
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
          key={selectedVariant?.id}
          image={selectedVariant?.image}
          images={galleryImages.length > 0 ? galleryImages : undefined}
        />

        {/* Buy box */}
        <div className="product-buybox">
          <h1 className="product-title">{title}</h1>

          {/* Rating link */}
          {reviewSummary && (
            <a href="#reviews" className="product-rating-link">
              <span className="product-rating-stars" aria-hidden="true">
                ★★★★★
              </span>
              <span>
                {reviewSummary.averageRating.toLocaleString('de-DE')}/5 ·{' '}
                {t.product.rating(reviewSummary.totalCount)}
              </span>
            </a>
          )}

          <p className="product-market-badge">{t.product.marketBadge}</p>

          {descriptionHtml ? (
            <div
              className="product-intro"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          ) : (
            <p className="product-intro">{t.product.intro}</p>
          )}

          {/* Form */}
          <ProductForm
            productOptions={productOptions}
            selectedVariant={selectedVariant}
            selectedSellingPlanId={selectedSellingPlan?.sellingPlan.id ?? null}
            onSellingPlanChange={selectSellingPlan}
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

      <ProductTemplateSections
        template={product.pageTemplate?.value}
        sections={product.pdpSections}
        variantSteps={selectedVariant?.filtrationSteps}
        images={images}
        reviews={reviews}
        reviewSummary={reviewSummary}
      />

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
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  sellingPlanId: selectedSellingPlan?.sellingPlan.id,
                },
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

const PDP_METAOBJECT_FRAGMENTS = `#graphql
  fragment PdpAssetReference on MetafieldReference {
    ... on MediaImage {
      id
      image {
        id
        url
        altText
        width
        height
      }
    }
    ... on GenericFile {
      id
      url
      alt
    }
  }

  fragment PdpNestedReference on MetafieldReference {
    ...PdpAssetReference
    ... on Metaobject {
      id
      type
      handle
      fields {
        key
        type
        value
        reference {
          ...PdpAssetReference
        }
      }
    }
  }

  fragment PdpSectionReference on MetafieldReference {
    ... on Metaobject {
      id
      type
      handle
      fields {
        key
        type
        value
        reference {
          ...PdpAssetReference
        }
        references(first: 30) {
          nodes {
            ...PdpNestedReference
          }
        }
      }
    }
  }
` as const;

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
    gallery: metafield(namespace: "custom", key: "gallery") {
      references(first: 20) {
        nodes {
          ... on MediaImage {
            id
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
    specifications: metafield(namespace: "custom", key: "specifications") {
      type
      value
    }
    filtrationSteps: metafield(namespace: "custom", key: "filtration_steps") {
      references(first: 20) {
        nodes {
          ...PdpNestedReference
        }
      }
    }
    sellingPlanAllocations(first: 20) {
      nodes {
        sellingPlan {
          id
          name
          description
          recurringDeliveries
          options {
            name
            value
          }
        }
        priceAdjustments {
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          perDeliveryPrice {
            amount
            currencyCode
          }
        }
      }
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
    pageTemplate: metafield(namespace: "custom", key: "page_template") {
      value
    }
    pdpSections: metafield(namespace: "custom", key: "pdp_sections") {
      references(first: 30) {
        nodes {
          ...PdpSectionReference
        }
      }
    }
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
  ${PDP_METAOBJECT_FRAGMENTS}
` as const;
