import type {Route} from './+types/collections.all';
import {redirect, useLoaderData} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {FeatureSplit} from '~/components/FeatureSplit';
import {BenefitsMarquee} from '~/components/BenefitsMarquee';
import {
  CollectionSort,
  getSortOption,
  type SortOption,
} from '~/components/CollectionSort';

const CATALOG_SORTS: Record<SortOption, {sortKey: string; reverse: boolean}> = {
  featured: {sortKey: 'ID', reverse: false},
  relevance: {sortKey: 'RELEVANCE', reverse: false},
  'best-selling': {sortKey: 'BEST_SELLING', reverse: false},
  'title-ascending': {sortKey: 'TITLE', reverse: false},
  'title-descending': {sortKey: 'TITLE', reverse: true},
  'price-ascending': {sortKey: 'PRICE', reverse: false},
  'price-descending': {sortKey: 'PRICE', reverse: true},
  'created-ascending': {sortKey: 'CREATED_AT', reverse: false},
  'created-descending': {sortKey: 'CREATED_AT', reverse: true},
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Alle Produkte | Phoenix'}];
};

export async function loader(args: Route.LoaderArgs) {
  const url = new URL(args.request.url);

  if (
    args.request.headers.get('accept')?.includes('text/html') &&
    (url.searchParams.has('cursor') || url.searchParams.has('direction'))
  ) {
    url.searchParams.delete('cursor');
    url.searchParams.delete('direction');
    throw redirect(`${url.pathname}${url.search}`);
  }
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const sort = CATALOG_SORTS[getSortOption(request)];

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables, ...sort},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      {/* <h1>Alle Produkte</h1> */}
      <FeatureSplit
        noPadding
        imageSide="right"
        imageSrc="/images/collection/view-products.jpg"
        heading="Alle Produkte"
      />
      <BenefitsMarquee />
      <CollectionSort />
      <PaginatedResourceSection<CollectionItemFragment>
        connection={products}
        infiniteScroll
        resourcesClassName="grid grid-cols-2 gap-6 lg:grid-cols-4"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: $sortKey,
      reverse: $reverse
    ) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
