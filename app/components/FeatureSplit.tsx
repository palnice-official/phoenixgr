import {Link} from 'react-router';
import type {ReactNode, VideoHTMLAttributes} from 'react';

interface FeatureImage {
  src: string;
  alt: string;
}

interface FeatureSplitProps {
  imageSide: 'left' | 'right';
  heading: string;
  body: ReactNode;
  cta?: {
    text: string;
    href: string;
  };
  imageSrc?: string;
  imageAlt?: string;
  images?: FeatureImage[];
  video?: VideoHTMLAttributes<HTMLVideoElement> & {
    src: string;
    captionsSrc?: string;
  };
}

export function FeatureSplit({
  imageSide,
  heading,
  body,
  cta,
  imageSrc,
  imageAlt,
  images,
  video,
}: FeatureSplitProps) {
  const isLeft = imageSide === 'left';
  const hasGrid = images && images.length > 1;
  const hasMedia = Boolean(video || hasGrid || imageSrc);

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className={`mx-auto ${hasMedia ? 'max-w-7xl' : 'max-w-5xl'}`}>
        <div
          className={
            hasMedia
              ? `flex flex-col items-center gap-12 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`
              : ''
          }
        >
          {hasMedia && (
            <div className="w-full md:w-1/2">
              {video ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <FeatureVideo label={imageAlt || heading} video={video} />
                </div>
              ) : hasGrid ? (
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
                    src={imageSrc}
                    alt={imageAlt || ''}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className={hasMedia ? 'w-full md:w-1/2' : 'w-full'}>
            <h2 className="mb-6 font-display text-3xl font-bold text-brand-dark md:text-4xl">
              {heading}
            </h2>
            <div className="mb-8 text-lg leading-relaxed text-neutral-600">
              {body}
            </div>
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

function FeatureVideo({
  label,
  video,
}: {
  label: string;
  video: NonNullable<FeatureSplitProps['video']>;
}) {
  const {captionsSrc, ...videoProps} = video;
  return (
    <video
      {...videoProps}
      aria-label={label}
      className="h-full w-full object-cover"
    >
      <track
        default
        kind="captions"
        src={captionsSrc || 'data:text/vtt,WEBVTT%0A%0A'}
        srcLang="de"
      />
    </video>
  );
}
