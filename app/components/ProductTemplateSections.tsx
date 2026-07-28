import {ComparisonTable} from '~/components/ComparisonTable';
import {FeatureGrid} from '~/components/FeatureGrid';
import {FeatureSplit} from '~/components/FeatureSplit';
import {FinalCTA} from '~/components/FinalCTA';
import {GuaranteeSection} from '~/components/GuaranteeSection';
import {HowItWorks} from '~/components/HowItWorks';
import {ProductGalleryStrip} from '~/components/ProductGalleryStrip';
import {ProductRemoves} from '~/components/ProductRemoves';
import {ReviewsCarousel} from '~/components/ReviewsCarousel';
import {ThreeSteps} from '~/components/ThreeSteps';
import {DynamicProductSections} from '~/components/DynamicProductSections';
import type {Review, ReviewSummary} from '~/lib/reviews.server';

interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

interface ProductTemplateProps {
  images: ProductImage[];
  reviews: Review[];
  reviewSummary: ReviewSummary | null;
}

interface ProductTemplateSectionsProps extends ProductTemplateProps {
  template?: string | null;
  sections?: unknown;
  variantSteps?: unknown;
}

const PRODUCT_TEMPLATES = {
  default: WaterFilterTemplate,
  'water-filter': WaterFilterTemplate,
  'replacement-filter': ReplacementFilterTemplate,
};

export function ProductTemplateSections({
  template,
  sections,
  variantSteps,
  ...props
}: ProductTemplateSectionsProps) {
  const hasDynamicSections = Boolean(
    sections &&
    typeof sections === 'object' &&
    (sections as {references?: {nodes?: unknown[]}}).references?.nodes?.length,
  );

  if (hasDynamicSections) {
    return (
      <DynamicProductSections
        sections={sections}
        variantSteps={variantSteps}
        {...props}
      />
    );
  }

  const Template =
    PRODUCT_TEMPLATES[template as keyof typeof PRODUCT_TEMPLATES] ??
    PRODUCT_TEMPLATES.default;

  return <Template {...props} />;
}

function WaterFilterTemplate({
  images,
  reviews,
  reviewSummary,
}: ProductTemplateProps) {
  return (
    <>
      <ProductRemoves
        heading="Unsere Filter entfernen …"
        items={[
          'Schwermetalle',
          'PFAS',
          'Mikroplastik',
          'Chlor',
          'Bakterien',
          'Pestizide',
        ]}
      />
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
      <FeatureSplit
        imageSide="right"
        heading="Für viele Jahre gebaut"
        body="Lebensmittelechter Edelstahl AISI 304 ersetzt Kunststoff, benötigt weder Strom noch Wasseranschluss und macht das System robust, mobil und besonders einfach zu warten."
        imageSrc={images[2]?.url || images[0]?.url}
        imageAlt="Phoenix Wasserfilter aus Edelstahl"
      />
      <FeatureSplit
        imageSide="left"
        heading="So funktioniert der Phoenix"
        body={
          <>
            <p>
              Der Phoenix reinigt Wasser ohne Strom und ohne festen
              Wasseranschluss.
            </p>
            <p className="mt-4">
              Das Filtersystem entfernt Verunreinigungen und erhält wichtige
              Mineralien.
            </p>
          </>
        }
        video={{
          src: 'https://cdn.shopify.com/videos/c/o/v/4c32c43c15924de0b503e84991493b60.mp4',
          poster: 'https://cdn.shopify.com/images/phoenix-video-cover.jpg',
          captionsSrc: '/videos/phoenix-de.vtt',
          autoPlay: true,
          muted: true,
          loop: true,
          controls: false,
          playsInline: true,
          preload: 'metadata',
        }}
        cta={{
          text: 'Jetzt bestellen',
          href: '/products/the-phoenix-gravity-wasserfilter',
        }}
      />
      <HowItWorks />
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
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Erfahrungen unserer Kundinnen und Kunden"
      />
      <ProductGalleryStrip images={images} />
      <FinalCTA imageUrl={images[4]?.url || images[0]?.url} />
    </>
  );
}

function ReplacementFilterTemplate({
  images,
  reviews,
  reviewSummary,
}: ProductTemplateProps) {
  return (
    <>
      <FeatureSplit
        imageSide="right"
        heading="Volle Filterleistung zurück"
        body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
        imageSrc={images[1]?.url || images[0]?.url}
        imageAlt="Phoenix Ersatzfilter"
      />
      <ThreeSteps
        steps={[
          {
            icon: '',
            title: 'Alte Filter entfernen',
            body: 'Verbrauchte Filterelemente aus dem oberen Behälter lösen.',
            order: 1,
          },
          {
            icon: '',
            title: 'Neue Filter einsetzen',
            body: 'Den neuen Filtersatz befestigen und sicher festziehen.',
            order: 2,
          },
          {
            icon: '',
            title: 'Spülen und genießen',
            body: 'Filter wie beschrieben spülen und das System neu befüllen.',
            order: 3,
          },
        ]}
      />
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Erfahrungen unserer Kundinnen und Kunden"
      />
      <ProductGalleryStrip images={images} />
    </>
  );
}
