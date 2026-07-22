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
// If Judge.me is unreachable, reviews=[] and the section renders nothing —
// never fabricate ratings.
// -----------------------------------------------------------------------------
import {Link} from 'react-router';
import type {Review, ReviewSummary} from '~/lib/reviews.server';
import {t} from '~/lib/t';

export function ReviewsCarousel({
  reviews,
  summary,
  heading,
}: {
  reviews: Review[];
  summary: ReviewSummary | null;
  heading: string;
}) {
  if (!reviews.length) return null;

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 font-display text-3xl md:text-4xl">{heading}</h2>
          {summary && (
            <p className="text-sm text-neutral-600">
              <Stars rating={summary.averageRating} />{' '}
              {t.reviews.averageLabel(
                summary.averageRating.toLocaleString('de-DE'),
              )}{' '}
              · {t.reviews.basedOn(summary.totalCount)}
            </p>
          )}
          <Link
            to="/pages/bewertungen"
            className="mt-2 inline-block text-sm font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            {t.cta.viewAllReviews}
          </Link>
        </div>

        {/* Scroll-snap carousel; native scrolling = free touch support */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="w-[85%] shrink-0 snap-center rounded-2xl border border-neutral-200 bg-surface p-6 sm:w-[45%] lg:w-[31%]"
            >
              <Stars rating={review.rating} />
              <blockquote className="mt-3 line-clamp-6 text-sm leading-relaxed text-neutral-700">
                {review.body}
              </blockquote>
              <footer className="mt-4 text-sm font-semibold text-brand-dark">
                {review.author}
                {review.verified && (
                  <span className="ml-2 text-xs font-normal text-emerald-700">
                    ✓ Verifizierter Kauf
                  </span>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars({rating}: {rating: number}) {
  const full = Math.round(rating);
  return (
    <span
      aria-label={t.reviews.starsAria(full)}
      className="text-brand-gold"
      role="img"
    >
      {'★'.repeat(full)}
      <span className="text-neutral-300">{'★'.repeat(5 - full)}</span>
    </span>
  );
}
