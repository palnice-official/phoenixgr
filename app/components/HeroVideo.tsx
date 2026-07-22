import {Link} from 'react-router';
import {config, formatEUR} from '~/lib/config';
import {t} from '~/lib/t';
import type {ReviewSummary} from '~/lib/reviews.server';

interface Product {
  title?: string;
  priceRange?: {
    minVariantPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice?: {
      amount: string;
      currencyCode: string;
    };
  };
}

export function HeroVideo({
  product,
  discountPct,
  reviewSummary,
  videoUrl,
  posterUrl,
}: {
  product: Product;
  discountPct: number;
  reviewSummary: ReviewSummary | null;
  videoUrl?: string;
  posterUrl?: string;
}) {
  const currentPrice = Number(product?.priceRange?.minVariantPrice?.amount ?? 0);
  const compareAtPrice = Number(product?.compareAtPriceRange?.minVariantPrice?.amount ?? 0);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Video Background */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : posterUrl ? (
        <img
          src={posterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-gold">
            NSF-zertifiziert · 50+ Jahre Erfahrung
          </p>

          {/* Headline */}
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Reinheit, die man schmeckt.
            <span className="block text-brand-gold italic">Phoenix.</span>
          </h1>

          {/* Star Rating */}
          {reviewSummary && (
            <Link
              to="/pages/bewertungen"
              className="mb-6 inline-flex items-center gap-2 text-white hover:text-brand-gold"
            >
              <span className="text-brand-gold">★★★★★</span>
              <span className="text-sm">
                {reviewSummary.averageRating.toLocaleString('de-DE')}/5 aus{' '}
                {reviewSummary.totalCount.toLocaleString('de-DE')} Bewertungen
              </span>
            </Link>
          )}

          {/* Price Block */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white md:text-4xl">
                {formatEUR(currentPrice)}
              </span>
              {compareAtPrice > 0 && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatEUR(compareAtPrice)}
                </span>
              )}
              {discountPct > 0 && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                  {t.price.discountBadge(discountPct)}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-neutral-300">
              {t.price.taxNote}{' '}
              <Link
                to={t.price.shippingPagePath}
                className="underline hover:text-white"
              >
                {t.price.taxNoteShippingWord}
              </Link>
            </p>
          </div>

          {/* CTA */}
          <Link
            to={`/products/${config.productHandle}`}
            className="mb-6 inline-block rounded-full bg-brand-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
          >
            {t.cta.orderNow}
          </Link>

          {/* Trust Line */}
          <div className="flex flex-wrap gap-6 text-sm text-neutral-300">
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              100-Tage Geld-zurück
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              NSF-zertifiziert
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Kostenloser Versand
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
