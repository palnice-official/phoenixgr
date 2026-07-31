// app/components/ReviewsCarousel.tsx
// -----------------------------------------------------------------------------
// Swipeable reviews section (AI_CONTEXT.md §6.9), provider-agnostic: receives
// plain data fetched server-side via app/lib/reviews.server.ts (Judge.me).
//
// Wiring in app/routes/_index.tsx:
//   const [reviews, summary] = await Promise.all([
//     getReviews(context.env, {perPage: 8}),
//     getReviewSummary(context.env),
//   ]);
//   ...
//   <ReviewsCarousel reviews={reviews} summary={summary} />
//
// Until Judge.me is configured, the section falls back to sample reviews.
// -----------------------------------------------------------------------------
import {useRef} from 'react';
import {Link} from 'react-router';
import type {Review, ReviewSummary} from '~/lib/reviews.server';
import {t} from '~/lib/t';

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'sample-1',
    author: 'Anna M.',
    body: 'Das Wasser schmeckt deutlich frischer und das System war schnell aufgebaut. Wir möchten unseren Phoenix nicht mehr missen.',
    rating: 5,
    createdAt: '2026-05-12',
    verified: true,
  },
  {
    id: 'sample-2',
    author: 'Michael K.',
    body: 'Sehr gute Verarbeitung, einfache Bedienung und eine spürbare Verbesserung der Wasserqualität.',
    rating: 5,
    createdAt: '2026-04-28',
    verified: true,
  },
  {
    id: 'sample-3',
    author: 'Sophie L.',
    body: 'Die Lieferung war schnell und die Inbetriebnahme unkompliziert. Besonders überzeugt uns der klare Geschmack.',
    rating: 2,
    createdAt: '2026-03-19',
    verified: true,
  },
];
export function ReviewsCarousel({
  reviews,
  summary,
  heading,
}: {
  reviews: Review[];
  summary: ReviewSummary | null;
  heading: string;
}) {
  const displayedReviews = reviews.length ? reviews : SAMPLE_REVIEWS;
  const carouselRef = useRef<HTMLUListElement>(null);
  const scrollbarRef = useRef<HTMLInputElement>(null);

  return (
    <section className="overflow-hidden bg-white pb-14 pt-2 md:pb-20 md:pt-2">
      <div className="mx-auto max-w-[1097px] px-[14px] sm:px-8 md:px-10">
        <div className="max-w-[650px]">
          <Stars rating={summary?.averageRating ?? 5} />
          <h2 className="mb-0 mt-3 font-sans text-[23px] font-medium leading-[1.15] text-brand-dark sm:text-3xl md:text-[38px]">
            {heading}
          </h2>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-dark">
            Basierend auf Kundenbewertungen
          </p>
          <Link
            to="/pages/bewertungen"
            className="mt-5 box-border flex h-14 w-full items-center justify-center rounded-full border border-solid border-brand-dark bg-white px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark transition hover:bg-brand-dark hover:text-white md:mt-3 md:h-10 md:w-[245px]"
          >
            {t.cta.viewAllReviews}
          </Link>
        </div>

        {/* Scroll-snap carousel; native scrolling = free touch support */}
        <ul
          ref={carouselRef}
          className="-mx-[14px] mt-11 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[14px] [scrollbar-width:none] sm:-mx-8 sm:px-8 md:-mx-10 md:mt-10 md:px-10 [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            const max =
              event.currentTarget.scrollWidth - event.currentTarget.clientWidth;
            if (scrollbarRef.current) {
              scrollbarRef.current.value = String(
                max ? (event.currentTarget.scrollLeft / max) * 100 : 0,
              );
            }
          }}
        >
          {displayedReviews.map((review) => (
            <li
              key={review.id}
              className="m-0 box-border flex min-h-[275px] w-full shrink-0 snap-center flex-col rounded-xl bg-[#f6f4f1] p-7 sm:w-[45%] md:min-h-[215px] md:w-[30%] md:p-6"
            >
              {review.body.length > 180 ? (
                <details className="group">
                  <blockquote className="m-0 line-clamp-8 text-base leading-[1.55] text-brand-dark group-open:hidden md:text-sm">
                    {review.body}
                  </blockquote>
                  <blockquote className="m-0 hidden text-base leading-[1.55] text-brand-dark group-open:block md:text-sm">
                    {review.body}
                  </blockquote>
                  <summary className="mt-1 cursor-pointer list-none text-xs text-brand-dark [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Mehr lesen</span>
                    <span className="hidden group-open:inline">
                      Weniger anzeigen
                    </span>
                  </summary>
                </details>
              ) : (
                <blockquote className="m-0 text-base leading-[1.55] text-brand-dark md:text-sm">
                  {review.body}
                </blockquote>
              )}
              <footer className="mt-auto pt-5 text-base font-semibold text-brand-dark md:text-sm">
                {review.author}
              </footer>
            </li>
          ))}
        </ul>
        <input
          ref={scrollbarRef}
          aria-label="Bewertungen scrollen"
          className="mt-6 block h-[3px] w-full cursor-ew-resize appearance-none rounded-none bg-neutral-200 p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-dark [&::-moz-range-thumb]:h-[3px] [&::-moz-range-thumb]:w-[40%] [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-dark [&::-moz-range-track]:h-[3px] [&::-moz-range-track]:bg-neutral-200 [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:bg-neutral-200 [&::-webkit-slider-thumb]:h-[3px] [&::-webkit-slider-thumb]:w-[40%] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-brand-dark"
          defaultValue="0"
          max="100"
          min="0"
          onInput={(event) => {
            const carousel = carouselRef.current;
            if (!carousel) return;
            carousel.scrollLeft =
              (Number(event.currentTarget.value) / 100) *
              (carousel.scrollWidth - carousel.clientWidth);
          }}
          type="range"
        />
      </div>
    </section>
  );
}

function Stars({rating}: {rating: number}) {
  const full = Math.round(rating);
  return (
    <span
      aria-label={t.reviews.starsAria(full)}
      className="inline-block text-[28px] leading-none tracking-[-0.08em] text-[#ffb000] md:text-xl"
      role="img"
    >
      {'★'.repeat(full)}
      <span className="text-neutral-300">{'★'.repeat(5 - full)}</span>
    </span>
  );
}
