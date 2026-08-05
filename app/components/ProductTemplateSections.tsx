import type { ComponentProps, ReactNode } from 'react';
import { ComparisonTable } from '~/components/ComparisonTable';
import { FeatureSplit } from '~/components/FeatureSplit';
import { GuaranteeSection } from '~/components/GuaranteeSection';
import { HowItWorks } from '~/components/HowItWorks';
import { ProductFaq } from '~/components/ProductFaq';
import { ProductGalleryStrip } from '~/components/ProductGalleryStrip';
import { ProductRemoves } from '~/components/ProductRemoves';
import { ReviewsCarousel } from '~/components/ReviewsCarousel';
import { ThreeSteps } from '~/components/ThreeSteps';
import { DynamicProductSections } from '~/components/DynamicProductSections';
import type { Review, ReviewSummary } from '~/lib/reviews.server';
import { CardsSection } from './CardsSection';
import { ProductAccordion } from '~/components/ProductAccordion';
import { BenefitsMarquee } from './BenefitsMarquee';
import { AddToCartButton } from './AddToCartButton';

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
  comparisonCta?: ReactNode;
  accordionItems: ComponentProps<typeof ProductAccordion>['items'];
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
  'accessories': AccessoriesTemplate
};

export function ProductTemplateSections({
  template,
  sections,
  variantSteps,
  accordionItems,
  ...props
}: ProductTemplateSectionsProps) {
  const hasDynamicSections = Boolean(
    sections &&
    typeof sections === 'object' &&
    (sections as { references?: { nodes?: unknown[] } }).references?.nodes?.length,
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

  return <Template {...props} accordionItems={accordionItems} />;
}

function WaterFilterTemplate({
  images,
  reviews,
  reviewSummary,
  comparisonCta,
  accordionItems,
}: ProductTemplateProps) {
  return (
    <>
      {/* Accordions */}
      <ProductAccordion items={accordionItems} />

      <FeatureSplit
        imageSide="right"
        heading="Aktivkohlefiltration für den Alltag"
        body={
          <>
            <p>
              Die Filterelemente bestehen aus hochwertiger Aktivkohle auf
              Kokosnussschalenbasis. Sie verbessern Geschmack und Geruch des
              Wassers, ohne Strom oder einen festen Wasseranschluss zu benötigen.
            </p>
            <p className="mt-6">
              <strong>Wie funktioniert das?</strong>
            </p>
            <p className="mt-6">
              Das Wasser fließt allein durch die Schwerkraft langsam durch die
              Filter. Dadurch bleibt ausreichend Kontaktzeit mit der Aktivkohle,
              bevor das gefilterte Wasser in der unteren Kammer gesammelt wird.
            </p>
          </>
        }
      />
      <ProductRemoves
        heading="Unsere Filter entfernen …"
        items={['Mikroplastik', 'Blei', 'PFAS', 'Chlor', 'Schwermetalle']}
      />

      <section className="aspect-[3/2] h-auto w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block h-auto w-full"
        >
          <source src="https://cdn.shopify.com/videos/c/o/v/4c32c43c15924de0b503e84991493b60.mp4" type="video/mp4" />
        </video>
      </section>
      <HowItWorks />
      <FeatureSplit
        imageSide="right"
        heading="Aktivkohlefiltration für den Alltag"
        body={
          <>
            <p>
              Die Filterelemente bestehen aus hochwertiger Aktivkohle auf
              Kokosnussschalenbasis. Sie verbessern Geschmack und Geruch des
              Wassers, ohne Strom oder einen festen Wasseranschluss zu benötigen.
            </p>
            <p className="mt-6">
              <strong>Wie funktioniert das?</strong>
            </p>
            <p className="mt-6">
              Das Wasser fließt allein durch die Schwerkraft langsam durch die
              Filter. Dadurch bleibt ausreichend Kontaktzeit mit der Aktivkohle,
              bevor das gefilterte Wasser in der unteren Kammer gesammelt wird.
            </p>
          </>
        }
      />
      <FeatureSplit
        imageSide="left"
        heading="Für viele Jahre gebaut"
        body="Lebensmittelechter Edelstahl AISI 304 ersetzt Kunststoff, benötigt weder Strom noch Wasseranschluss und macht das System robust, mobil und besonders einfach zu warten."
        imageSrc={images[2]?.url || images[0]?.url}
        imageAlt="Phoenix Wasserfilter aus Edelstahl"
      />
      <FeatureSplit
        imageSide="left"
        heading="Filtern ohne Strom und Wasseranschluss"
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
          autoPlay: true,
          muted: true,
          loop: true,
          controls: false,
          playsInline: true,
          preload: 'metadata',
        }}
        cta={{
          text: 'Jetzt bestellen',
          href: '/products/le-filtre-a-eau-par-gravite-phoenix-test',
        }}
      />

      <ComparisonTable
        cta={comparisonCta}
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

      <GuaranteeSection imageUrl={images[3]?.url || images[0]?.url} />
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Seit über 50 Jahren steht Phoenix für Wasserfiltration"
      />
      <ProductFaq />
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
      <BenefitsMarquee />

      <section className="aspect-[3/2] h-auto w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block h-auto w-full"
        >
          <source src="\images\homePage\main.mp4" type="video/mp4" />
        </video>
      </section>


      <FeatureSplit
        imageSide="right"
        heading="Volle Filterleistung zurück"
        body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
      />

      <div className="replacement-filter-feature">
        <FeatureSplit
          imageSide="left"
          heading="Volle Filterleistung zurück"
          body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
          imageSrc="/images/homePage/tap-water.jpg"
          imageAlt="Phoenix Ersatzfilter"
        />
      </div>

      <FeatureSplit
        imageSide="right"
        heading="Volle Filterleistung zurück"
        body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
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
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Seit über 50 Jahren steht Phoenix für Wasserfiltration"
      />
      <ProductGalleryStrip images={images} />
    </>
  );
}
function AccessoriesTemplate({
  images,
  reviews,
  reviewSummary,
  accordionItems
}: ProductTemplateProps) {
  return (
    <>
     
    <ProductAccordion items={accordionItems} />

     <FeatureSplit
        imageSide="right"
        heading="Volle Filterleistung zurück"
        body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
      />

      
        <FeatureSplit
          imageSide="right"
          heading="Volle Filterleistung zurück"
          body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
          imageSrc="/images/homePage/tap-water.jpg"
          imageAlt="Phoenix Ersatzfilter"
        />

        <FeatureSplit
          imageSide="right"
          heading="Volle Filterleistung zurück"
          body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
        />
     


      <section className="aspect-[3/2] h-auto w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="block h-auto w-full"
        >
          <source src="\images\homePage\main.mp4" type="video/mp4" />
        </video>
      </section>


      <FeatureSplit
        imageSide="right"
        heading="Volle Filterleistung zurück"
        body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
      />

      <div className="replacement-filter-feature">
        <FeatureSplit
          imageSide="left"
          heading="Volle Filterleistung zurück"
          body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
          imageSrc="/images/homePage/tap-water.jpg"
          imageAlt="Phoenix Ersatzfilter"
        />
      </div>

      <FeatureSplit
        imageSide="right"
        heading="Volle Filterleistung zurück"
        body="Mit einem frischen Filtersatz arbeitet Ihr Phoenix wieder mit optimaler Durchflussrate und zuverlässiger Filterleistung."
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
      <ReviewsCarousel
        reviews={reviews}
        summary={reviewSummary}
        heading="Seit über 50 Jahren steht Phoenix für Wasserfiltration"
      />
      <ProductGalleryStrip images={images} />
    </>
  );
}
