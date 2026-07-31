import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {getSeoMeta} from '@shopify/hydrogen';
import {HeroVideo} from '~/components/HeroVideo';
import {FeatureSplit} from '~/components/FeatureSplit';
import {FeatureGrid} from '~/components/FeatureGrid';
import {ImpactCalculator} from '~/components/ImpactCalculator';
import {ComparisonTable} from '~/components/ComparisonTable';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {HowItWorks} from '~/components/HowItWorks';
import {ThreeSteps} from '~/components/ThreeSteps';
import {GuaranteeSection} from '~/components/GuaranteeSection';
import {ReviewsCarousel} from '~/components/ReviewsCarousel';
import {WhatsInTheBox} from '~/components/WhatsInTheBox';
import {LabReports} from '~/components/LabReports';
import {FinalCTA} from '~/components/FinalCTA';
import {ProductGalleryStrip} from '~/components/ProductGalleryStrip';
import {config, getEnvConfig} from '~/lib/config';
import {getReviews, getReviewSummary} from '~/lib/reviews.server';

export function meta() {
  return getSeoMeta({
    title: 'Phoenix Wasserfiltersysteme Deutschland',
    description:
      'Hochwertige Edelstahl-Schwerkraft-Wasserfiltersysteme für reines, sauberes Trinkwasser. NSF-zertifiziert, 100 Tage Geld-zurück-Garantie.',
  });
}

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [product, reviews, reviewSummary, metaobjects] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: config.productHandle,
        language: 'DE',
        country: 'DE',
      },
    }),
    getReviews(context.env, {perPage: 8}),
    getReviewSummary(context.env),
    fetchMetaobjects(context),
  ]);
  const envConfig = getEnvConfig(context.env);

  return {
    product: product?.product,
    reviews,
    reviewSummary,
    metaobjects,
    heroVideoUrl: envConfig.heroVideoUrl,
    heroPosterUrl: envConfig.heroPosterUrl,
  };
}

type MetaobjectField = {
  key: string;
  value?: string | null;
  reference?: {image?: {url: string} | null; url?: string | null} | null;
};
type MetaobjectNode = {fields: MetaobjectField[]};

async function fetchMetaobjects(context: Route.LoaderArgs['context']) {
  const empty = {comparisonRows: [], steps: [], boxItems: [], labReports: []};
  try {
    const data = await context.storefront.query(METAOBJECTS_QUERY, {
      cache: context.storefront.CacheLong(),
    });
    const fields = (node: MetaobjectNode) =>
      Object.fromEntries(node.fields.map((field) => [field.key, field]));
    const value = (field?: MetaobjectField) => field?.value ?? '';
    const file = (field?: MetaobjectField) =>
      field?.reference?.image?.url ?? field?.reference?.url ?? value(field);

    return {
      comparisonRows: data.comparisonRows.nodes.map((node) => {
        const item = fields(node as MetaobjectNode);
        return {
          label: value(item.label),
          phoenix: value(item.phoenix) === 'true',
          other_systems: value(item.other_systems) === 'true',
          bottled: value(item.bottled) === 'true',
          pitchers: value(item.pitchers) === 'true',
        };
      }),
      steps: data.steps.nodes
        .map((node) => {
          const item = fields(node as MetaobjectNode);
          return {
            icon: file(item.icon),
            title: value(item.title),
            body: value(item.body),
            order: Number(value(item.order)) || 0,
          };
        })
        .sort((a, b) => a.order - b.order),
      boxItems: data.boxItems.nodes.map((node) => {
        const item = fields(node as MetaobjectNode);
        return {text: value(item.text)};
      }),
      labReports: data.labReports.nodes.map((node) => {
        const item = fields(node as MetaobjectNode);
        return {
          image: file(item.image),
          label: value(item.label),
          pdf: file(item.pdf),
        };
      }),
    };
  } catch (error) {
    console.error('Metaobjects konnten nicht geladen werden', error);
    return empty;
  }
}

const METAOBJECTS_QUERY = `#graphql
  query PhoenixHomepageMetaobjects {
    comparisonRows: metaobjects(type: "comparison_row", first: 50) {
      nodes { fields { key value reference { ...MetaobjectFile } } }
    }
    steps: metaobjects(type: "step_item", first: 10) {
      nodes { fields { key value reference { ...MetaobjectFile } } }
    }
    boxItems: metaobjects(type: "box_item", first: 30) {
      nodes { fields { key value reference { ...MetaobjectFile } } }
    }
    labReports: metaobjects(type: "lab_report", first: 20) {
      nodes { fields { key value reference { ...MetaobjectFile } } }
    }
  }
  fragment MetaobjectFile on MetafieldReference {
    ... on MediaImage { image { url } }
    ... on GenericFile { url }
  }
` as const;

const PRODUCT_QUERY = `#graphql
  query PhoenixHomepageProduct($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
    }
  }
` as const;

export default function Homepage() {
  const {product, reviews, reviewSummary, metaobjects, heroVideoUrl, heroPosterUrl} =
    useLoaderData<typeof loader>();
  const {open} = useAside();

  const currentPrice = Number(
    product?.priceRange?.minVariantPrice?.amount ?? 0,
  );
  const compareAtPrice = Number(
    product?.compareAtPriceRange?.minVariantPrice?.amount ?? 0,
  );
  const discountPct =
    compareAtPrice > 0
      ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
      : 0;

  const productImages = product?.images?.nodes ?? [];
  const comparisonVariant = product?.variants.nodes.find(
    (variant) => variant.availableForSale,
  );

  return (
    <>
      {/* 1. Hero — live pricing, stars, CTA, trust */}
      {product && (
        <HeroVideo
          product={product}
          discountPct={discountPct}
          reviewSummary={reviewSummary}
          videoUrl={heroVideoUrl}
          posterUrl={heroPosterUrl || productImages[0]?.url}
        />
      )}

      <ProductGalleryStrip images={productImages} />

      {/* 2. Innovation Pure — feature split with image grid */}
      <FeatureSplit
        imageSide="left"
        heading="Innovation trifft Reinheit"
        body="Entdecken Sie die Zukunft der Wasserfiltration. Der Phoenix Schwerkraft-Wasserfilter ist nicht nur ein Produkt — er ist ein Erlebnis, gefertigt aus hochwertigem Edelstahl AISI 304 für Langlebigkeit und Eleganz. Jeder Tropfen Wasser ist ein Symbol für Reinheit."
        cta={{
          text: 'Jetzt bestellen',
          href: `/products/${config.productHandle}`,
        }}
        images={
          productImages.length >= 4
            ? productImages.slice(0, 4).map((img) => ({
                src: img.url,
                alt: img.altText || 'Phoenix Wasserfilter',
              }))
            : undefined
        }
        imageSrc={productImages[0]?.url}
        imageAlt="Phoenix Wasserfilter Innovation"
      />

      {/* 3. Impact calculator */}
      <ImpactCalculator />

      {/* 4. Filtration technology */}
      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      {/* 5. Affordable beauty */}
      <FeatureSplit
        imageSide="left"
        heading="Beeindruckend im Design, unglaublich erschwinglich"
        body="Ganze-Haus-Filterlösungen kosten oft 150 € bis über 500 € und erfordern teuren Wartungsservice. Flaschenwasser verursacht hohe jährliche Kosten und verschwendet Lagerplatz. Der Phoenix Gravity Filter bietet eine elegante Lösung — reines Wasser für nur 8 Cent pro Liter. Einfach zu installieren, einfach zu warten."
        imageSrc={productImages[1]?.url || productImages[0]?.url}
        imageAlt="Phoenix Wasserfilter Erschwinglichkeit"
      />

      {/* 6. Advanced design */}
      <FeatureSplit
        imageSide="right"
        heading="Das fortschrittlichste System, das je entwickelt wurde"
        body="Der Phoenix Gravity Filter repräsentiert den Höhepunkt von 50 Jahren Forschung und Entwicklung. Sein schlichtes, minimalistisches Design ergänzt jeden Raum, während das fortschrittliche Filtersystem leise arbeitet, um zu gewährleisten, dass jedes Glas die Reinheit widerspiegelt."
        imageSrc={productImages[2]?.url || productImages[0]?.url}
        imageAlt="Phoenix fortgeschrittenes Filtersystem"
      />

      {/* 7. Designed for Perfection — feature grid */}
      <FeatureGrid />

      {/* 8. Lab reports / third-party testing */}
      <LabReports reports={metaobjects.labReports} />

      {/* 9. How it works */}
      <HowItWorks />

      {/* 10. Comparison table */}
      <ComparisonTable
        rows={metaobjects.comparisonRows}
        cta={
          comparisonVariant ? (
            <AddToCartButton
              lines={[{merchandiseId: comparisonVariant.id, quantity: 1}]}
              onClick={() => open('cart')}
            />
          ) : undefined
        }
      />

      {/* 10. Three steps */}
      <ThreeSteps steps={metaobjects.steps} />

      {/* 11. Guarantee */}
      <GuaranteeSection imageUrl={productImages[3]?.url || productImages[0]?.url} />

      {/* 12. Reviews */}
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Was unsere Kunden sagen"
      />

      {/* 13. What's in the box */}
      <WhatsInTheBox items={metaobjects.boxItems} imageUrl={productImages[4]?.url || productImages[0]?.url} />

      {/* 14. Final CTA */}
      <FinalCTA imageUrl={productImages[5]?.url || productImages[0]?.url} />
    </>
  );
}
