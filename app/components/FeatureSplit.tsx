import {Link} from 'react-router';

interface FeatureImage {
  src: string;
  alt: string;
}

interface FeatureSplitProps {
  imageSide: 'left' | 'right';
  heading: string;
  body: string;
  cta?: {
    text: string;
    href: string;
  };
  imageSrc?: string;
  imageAlt?: string;
  images?: FeatureImage[];
}

export function FeatureSplit({
  imageSide,
  heading,
  body,
  cta,
  imageSrc,
  imageAlt,
  images,
}: FeatureSplitProps) {
  const isLeft = imageSide === 'left';
  const hasGrid = images && images.length > 1;

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex flex-col items-center gap-12 ${
            isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
          }`}
        >
          {/* Image */}
          <div className="w-full md:w-1/2">
            {hasGrid ? (
              <div className="grid grid-cols-2 gap-3">
                {images!.map((img) => (
                  <div
                    key={img.src}
                    className="aspect-square overflow-hidden rounded-2xl"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={imageSrc || ''}
                  alt={imageAlt || ''}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2">
            <h2 className="mb-6 font-display text-3xl font-bold text-brand-dark md:text-4xl">
              {heading}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-neutral-600">
              {body}
            </p>
            {cta && (
              <Link
                to={cta.href}
                className="inline-block rounded-full bg-brand-blue px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
              >
                {cta.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
