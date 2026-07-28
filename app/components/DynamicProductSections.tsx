import {Fragment} from 'react';
import {RichText} from '@shopify/hydrogen';
import {ComparisonTable} from '~/components/ComparisonTable';
import {FeatureGrid} from '~/components/FeatureGrid';
import {FeatureSplit} from '~/components/FeatureSplit';
import {GuaranteeSection} from '~/components/GuaranteeSection';
import {HowItWorks} from '~/components/HowItWorks';
import {LabReports} from '~/components/LabReports';
import {ProductGalleryStrip} from '~/components/ProductGalleryStrip';
import {ProductRemoves} from '~/components/ProductRemoves';
import {ReviewsCarousel} from '~/components/ReviewsCarousel';
import {ThreeSteps} from '~/components/ThreeSteps';
import type {Review, ReviewSummary} from '~/lib/reviews.server';

interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

interface RawField {
  key: string;
  type?: string | null;
  value?: string | null;
  reference?: RawReference | null;
  references?: {nodes?: RawReference[] | null} | null;
}

interface RawReference {
  id?: string;
  type?: string;
  url?: string;
  alt?: string | null;
  image?: ProductImage | null;
  fields?: RawField[];
}

interface DynamicProductSectionsProps {
  sections: unknown;
  variantSteps?: unknown;
  images: ProductImage[];
  reviews: Review[];
  reviewSummary: ReviewSummary | null;
}

export function DynamicProductSections({
  sections,
  variantSteps,
  images,
  reviews,
  reviewSummary,
}: DynamicProductSectionsProps) {
  const sectionNodes = referenceNodes(sections).filter(isMetaobject);
  const overrideSteps = referenceNodes(variantSteps)
    .filter(isMetaobject)
    .map(parseStep);

  if (!sectionNodes.length) return null;

  return (
    <>
      {sectionNodes.map((section) => {
        const fields = fieldMap(section);
        const type = section.type || '';

        if (type.endsWith('pdp_feature_split')) {
          const sectionImages = imagesFrom(fields.images);
          const image = imageFrom(fields.image) || sectionImages[0];
          return (
            <FeatureSplit
              key={section.id}
              imageSide={value(fields.image_side) === 'left' ? 'left' : 'right'}
              heading={value(fields.heading)}
              body={<FieldBody field={fields.body} />}
              imageSrc={image?.url}
              imageAlt={image?.altText || value(fields.image_alt)}
              images={sectionImages.map((item) => ({
                src: item.url,
                alt: item.altText || '',
              }))}
              cta={ctaFrom(fields)}
            />
          );
        }

        if (type.endsWith('pdp_contaminants')) {
          const items = childMetaobjects(fields.items).map(
            (item) =>
              value(fieldMap(item).label) || value(fieldMap(item).title),
          );
          return (
            <ProductRemoves
              key={section.id}
              heading={value(fields.heading)}
              items={items.filter(Boolean)}
              resultText={value(fields.result_text) || undefined}
            />
          );
        }

        if (type.endsWith('pdp_steps')) {
          const steps = overrideSteps.length
            ? overrideSteps
            : childMetaobjects(fields.items || fields.steps).map(parseStep);
          return (
            <ThreeSteps
              key={section.id}
              heading={value(fields.heading) || undefined}
              steps={steps}
            />
          );
        }

        if (type.endsWith('pdp_comparison')) {
          const rows = childMetaobjects(fields.rows || fields.items).map(
            (row) => {
              const item = fieldMap(row);
              return {
                label: value(item.label),
                phoenix: booleanValue(item.phoenix),
                other_systems: booleanValue(item.other_systems),
                bottled: booleanValue(item.bottled),
                pitchers: booleanValue(item.pitchers),
              };
            },
          );
          return (
            <Fragment key={section.id}>
              <HowItWorks />
              <ComparisonTable
                heading={value(fields.heading) || undefined}
                rows={rows.filter((row) => row.label)}
              />
            </Fragment>
          );
        }

        if (type.endsWith('pdp_benefit_grid')) {
          const items = childMetaobjects(fields.items).map((item) => {
            const entry = fieldMap(item);
            return {
              icon:
                imageFrom(entry.icon)?.url ||
                value(entry.icon) ||
                value(entry.emoji),
              text: value(entry.text) || value(entry.body),
            };
          });
          return (
            <FeatureGrid
              key={section.id}
              heading={value(fields.heading) || undefined}
              items={items.filter((item) => item.text)}
              showCta={booleanValue(fields.show_cta, false)}
            />
          );
        }

        if (type.endsWith('pdp_guarantee')) {
          const image = imageFrom(fields.image);
          return (
            <GuaranteeSection
              key={section.id}
              heading={value(fields.heading) || undefined}
              body={<FieldBody field={fields.body} />}
              imageUrl={image?.url}
              imageAlt={image?.altText || value(fields.image_alt) || undefined}
              termsLink={value(fields.terms_link) || undefined}
            />
          );
        }

        if (type.endsWith('pdp_lab_reports')) {
          const reports = childMetaobjects(fields.reports || fields.items).map(
            (report) => {
              const item = fieldMap(report);
              return {
                image: imageFrom(item.image)?.url || '',
                label: value(item.label) || value(item.title),
                pdf: fileUrl(item.pdf),
              };
            },
          );
          return (
            <LabReports
              key={section.id}
              heading={value(fields.heading) || undefined}
              reports={reports.filter((report) => report.label && report.pdf)}
            />
          );
        }

        if (type.endsWith('pdp_faq')) {
          const items = childMetaobjects(fields.items).map((item) => {
            const entry = fieldMap(item);
            return {
              question: value(entry.question) || value(entry.title),
              answer: entry.answer || entry.body,
            };
          });
          return (
            <section
              key={section.id}
              className="bg-surface px-5 py-16 md:py-24"
            >
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-10 text-center font-display text-3xl font-bold text-brand-dark md:text-4xl">
                  {value(fields.heading) || 'Häufig gestellte Fragen'}
                </h2>
                <div className="space-y-3">
                  {items
                    .filter((item) => item.question)
                    .map((item) => (
                      <details
                        key={item.question}
                        className="rounded-xl bg-white p-5"
                      >
                        <summary className="cursor-pointer font-semibold text-brand-dark">
                          {item.question}
                        </summary>
                        <FieldBody
                          field={item.answer}
                          className="mt-4 text-neutral-600"
                        />
                      </details>
                    ))}
                </div>
              </div>
            </section>
          );
        }

        if (type.endsWith('pdp_reviews')) {
          return (
            <ReviewsCarousel
              key={section.id}
              reviews={reviews}
              summary={reviewSummary}
              heading={
                value(fields.heading) ||
                'Erfahrungen unserer Kundinnen und Kunden'
              }
            />
          );
        }

        if (type.endsWith('pdp_gallery')) {
          const sectionImages = imagesFrom(fields.images);
          return (
            <ProductGalleryStrip
              key={section.id}
              heading={value(fields.heading) || undefined}
              images={sectionImages.length ? sectionImages : images}
            />
          );
        }

        return null;
      })}
    </>
  );
}

function FieldBody({field, className}: {field?: RawField; className?: string}) {
  if (!field?.value) return null;
  if (field.type === 'rich_text_field') {
    return <RichText data={field.value} className={className} />;
  }
  return <p className={className}>{field.value}</p>;
}

function referenceNodes(input: unknown): RawReference[] {
  if (!input || typeof input !== 'object') return [];
  const references = (input as {references?: {nodes?: unknown[]}}).references;
  return Array.isArray(references?.nodes)
    ? (references.nodes as RawReference[])
    : [];
}

function isMetaobject(reference: RawReference): reference is RawReference & {
  id: string;
  type: string;
  fields: RawField[];
} {
  return Boolean(
    reference?.id && reference.type && Array.isArray(reference.fields),
  );
}

function fieldMap(metaobject: RawReference) {
  return Object.fromEntries(
    (metaobject.fields || []).map((field) => [field.key, field]),
  ) as Record<string, RawField | undefined>;
}

function value(field?: RawField) {
  return field?.value?.trim() || '';
}

function booleanValue(field?: RawField, fallback = false) {
  if (!field?.value) return fallback;
  return field.value === 'true';
}

function childMetaobjects(field?: RawField) {
  return (field?.references?.nodes || []).filter(isMetaobject);
}

function imageFrom(field?: RawField): ProductImage | undefined {
  return field?.reference?.image || undefined;
}

function imagesFrom(field?: RawField) {
  return (field?.references?.nodes || []).flatMap((node) =>
    node.image ? [node.image] : [],
  );
}

function fileUrl(field?: RawField) {
  return field?.reference?.url || value(field);
}

function parseStep(step: RawReference) {
  const fields = fieldMap(step);
  return {
    icon: imageFrom(fields.icon)?.url || fileUrl(fields.icon),
    title: value(fields.title),
    body: value(fields.body),
    order: Number(value(fields.order)) || 0,
  };
}

function ctaFrom(fields: Record<string, RawField | undefined>) {
  const text = value(fields.cta_text);
  const href = value(fields.cta_link);
  return text && href ? {text, href} : undefined;
}
