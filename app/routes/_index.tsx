import {useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {getSeoMeta} from '@shopify/hydrogen';
import {HeroVideo} from '~/components/HeroVideo';
import {BenefitsMarquee} from '~/components/BenefitsMarquee';
import {FeatureSplit} from '~/components/FeatureSplit';
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
import {WaterFilterCarousel} from '~/components/WaterFilterCarousel';
import {config} from '~/lib/config';
import {getReviews, getReviewSummary} from '~/lib/reviews.server';
import {FullWidthVideo} from '~/components/FullWidthVideo';
import {CardsSection} from '~/components/CardsSection';
import {FeatureVideo} from '~/components/FeatureVideo';

const localLabReports = [
  {
    image: '/images/lab/heavy_metal.png',
    label: 'Schwermetall-Laborbericht',
    pdf: '/images/lab/20231120_Atom_Lab_-_Phoenix_Carbon_Filter_-_Heavy_Metals.pdf',
  },
  {
    image: '/images/lab/pharma.png',
    label: 'Pharmazeutika und VOCs',
    pdf: '/images/lab/20231120-Atom-Lab-Phoenix_Carbon-Filte_-Pharmaceuticals-VOCs.pdf',
  },
  {
    image: '/images/lab/water_quality_2.png',
    label: 'Wasserqualitätsbericht USA 2024',
    pdf: '/images/lab/Phoenix_gravity_contaminants_lab_report_USA_Aug2024.pdf',
  },
];

const fallbackSteps = [
  {
    icon: '',
    title: 'Filter zusammenbauen',
    body: 'Folgen Sie einfach der beiliegenden Anleitung, um Ihren Filter zusammenzusetzen. Der Aufbau ist unkompliziert und dauert nur etwa 5 Minuten.',
    order: 1,
  },
  {
    icon: '',
    title: 'Leitungswasser einfüllen',
    body: 'Nehmen Sie den Deckel ab und füllen Sie Leitungswasser ein. Die Aktivkohle aus Kokosnussschalen filtert das Wasser ganz natürlich.',
    order: 2,
  },
  {
    icon: '',
    title: 'Großartigen Geschmack genießen',
    body: 'Schenken Sie sich ein Glas ein und erleben Sie sauberes, frisches Wasser mit deutlich verbessertem Geschmack.',
    order: 3,
  },
];

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

  return {
    product: product?.product,
    reviews,
    reviewSummary,
    metaobjects,
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
  const {product, reviews, reviewSummary, metaobjects} =
    useLoaderData<typeof loader>();
  const {open} = useAside();

  const productImages = product?.images?.nodes ?? [];
  const comparisonVariant = product?.variants.nodes.find(
    (variant) => variant.availableForSale,
  );

  return (
    <>
      <section className=" w-full">
        <img
          src="/images/homePage/USA_Website.jpg"
          alt="Phoenix Gravity water filtration system"
          className="block h-auto w-full"
        />
      </section>

      <HeroVideo />
      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      {/* <BenefitsMarquee /> */}
      <FeatureVideo />

      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      {/* <ProductGalleryStrip images={productImages} /> */}

      <WaterFilterCarousel />
      <FullWidthVideo
        videoUrl="/images/homePage/main.mp4"
        posterUrl="/images/homePage/main-poster.webp"
      />

      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      <WaterFilterCarousel
        slides={[
          {
            src: '/images/homePage/feature-icons/water-filter-eCom1.jpg',
            alt: 'Phoenix Wasserfilter in einer modernen Küche',
          },
        ]}
      />
      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      <HeroVideo
        videoUrl=""
        posterUrl=""
        heading="Pure innovation, pure water."
        description="Step into the future with our cutting-edge dual filtration technology. The Phoenix Gravity Water Filter isn't just a product; it's an experience, crafted from the finest AISI 304 Stainless Steel, ensuring durability and elegance. A simple, affordable way to enjoy clean, great-tasting filtered water."
        cta={{
          label: 'Try it with our 100-day money-back guarantee',
          to: `/products/${config.productHandle}`,
        }}
      />

      <section className=" w-full">
        <img
          src="/images/homePage/US_Img_1a_1.jpg"
          alt="Phoenix Gravity water filtration system"
          className="block h-auto w-full"
        />
      </section>

      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      <WaterFilterCarousel
        slides={[
          {
            src: '/images/homePage/feature-icons/water-filter-eCom1.jpg',
            alt: 'Phoenix Wasserfilter in einer modernen Küche',
          },
        ]}
      />

      <CardsSection
        backgroundImage="/images/CardsSection/filter-background-light.webp"
        heading="Sauberes Wasser kann so einfach sein"
        cards={[
          {
            icon: '/images/icons/icon-water.svg',
            title: 'Leistungsstarke Aktivkohlefilter',
            description:
              'Filterelemente auf Kokosnussschalenbasis verbessern Geschmack und Geruch des Wassers.',
          },
          {
            icon: '/images/icons/icon-bottle.svg',
            title: 'Weniger Einwegflaschen',
            description:
              'Gefiltertes Wasser direkt zu Hause reduziert Einkäufe, Lagerplatz und Verpackungsabfall.',
          },
          {
            icon: '/images/icons/icon-scales.svg',
            title: 'Flexibel und mobil',
            description:
              'Das freistehende System benötigt keinen Wasseranschluss und lässt sich bei Bedarf einfach umstellen.',
          },
          {
            icon: '/images/icons/icon-time.svg',
            title: 'Robuster Edelstahl',
            description:
              'Das Gehäuse aus lebensmittelechtem AISI-304-Edelstahl ist korrosionsbeständig und langlebig.',
          },
          {
            icon: '/images/icons/icon-approval.svg',
            title: 'Über 50 Jahre Erfahrung',
            description:
              'Phoenix entwickelt seit Jahrzehnten zuverlässige Lösungen für die Wasserfiltration.',
          },
          {
            icon: '/images/icons/icon-glass.svg',
            title: 'Einfach besserer Geschmack',
            description:
              'Die Aktivkohle reduziert störende Geschmacks- und Geruchsstoffe im Leitungswasser.',
          },
        ]}
      />

      {/* 3. Impact calculator */}
      {/* <ImpactCalculator /> */}

      {/* 8. Lab reports / third-party testing */}
      <LabReports
        heading="Unabhängige Laborberichte"
        reports={localLabReports}
      />

      {/* 10. Comparison table */}
      <ComparisonTable
        cta="Jetzt bestellen"
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
            label: 'Pflegeleicht',
            phoenix: true,
            other_systems: true,
            bottled: false,
            pitchers: false,
          },
          {
            label: 'Großes Fassungsvermögen',
            phoenix: true,
            other_systems: true,
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

      <FeatureSplit
        imageSide="right"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />
      {/* 10. Three steps */}
      <ThreeSteps
        heading="Kristallklares, wohlschmeckendes Wasser in 3 einfachen Schritten!"
        steps={metaobjects.steps.length ? metaobjects.steps : fallbackSteps}
      />

      <FullWidthVideo
        videoUrl="/images/homePage/main.mp4"
        posterUrl="/images/homePage/main-poster.webp"
      />

      {/* 11. Guarantee */}
      <GuaranteeSection
      // imageUrl={productImages[3]?.url || productImages[0]?.url}
      />
      <FeatureSplit
        imageSide="left"
        imageSrc="/images/homePage/phoenix-guarantee.v1.png"
        heading="Revolutionäre Filtrationstechnologie"
        body="Herkömmliche Filter fangen Schadstoffe nur ab und lassen sie sich vermehren — innerhalb von zwei Wochen werden sie zu Keimen von Verunreinigungen. Unsere Nanobakterien-Technologie löst dieses Problem: Aktivkohle aus Kokosnussschalen eliminiert Chemikalien, Toxine und Schwermetalle, während spezielle Adsorbentien das Bakterienwachstum im Filter selbst verhindern."
      />

      {/* 12. Reviews */}
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Was unsere Kunden sagen"
      />

      {/* 13. What's in the box */}
      <WhatsInTheBox
        items={metaobjects.boxItems}
        imageUrl={productImages[4]?.url || productImages[0]?.url}
      />

      {/* 14. Final CTA */}
      {/* <FinalCTA imageUrl={productImages[5]?.url || productImages[0]?.url} /> */}
    </>
  );
}
