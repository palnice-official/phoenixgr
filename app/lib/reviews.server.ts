// app/lib/reviews.server.ts
// -----------------------------------------------------------------------------
// Review provider abstraction (AI_CONTEXT.md §6.9). Currently: Judge.me.
// Server-only: uses the private Judge.me API token — never import this file
// into client components. Call `getReviews(env)` from a route loader and pass
// the result down as props.
//
// Required env vars (set in .env locally and in the Hydrogen channel per env):
//   JUDGEME_PRIVATE_TOKEN  — Judge.me dashboard → Settings → API
//   JUDGEME_SHOP_DOMAIN    — myshopify.com domain of the linked store
// -----------------------------------------------------------------------------

export interface Review {
  id: string;
  author: string;
  body: string;
  rating: number; // 1–5
  createdAt: string; // ISO date
  verified: boolean;
}

export interface ReviewSummary {
  averageRating: number; // e.g. 4.62
  totalCount: number; // e.g. 935
}

interface JudgeMeReview {
  id: number;
  reviewer?: {name?: string};
  body?: string;
  rating?: number;
  created_at?: string;
  verified?: string; // 'buyer' | 'nothing' | ...
  hidden?: boolean;
  curated?: string;
}
interface JudgeMeProduct {
  id: number;
  rating?: number;
  reviews_count?: number;
}

const JUDGEME_BASE = 'https://judge.me/api/v1';

function judgemeAuth(env: Env): {token: string; shop: string} | null {
  const token = env.JUDGEME_PRIVATE_TOKEN;
  const shop = env.JUDGEME_SHOP_DOMAIN;
  if (!token || !shop) return null;
  return {token, shop};
}

/**
 * Fetch published reviews. Fails soft: returns [] on any error so the
 * homepage never breaks because of a third-party outage.
 */
export async function getReviews(
  env: Env,
  opts: {perPage?: number; page?: number} = {},
): Promise<Review[]> {
  const auth = judgemeAuth(env);
  if (!auth) return [];

  const params = new URLSearchParams({
    api_token: auth.token,
    shop_domain: auth.shop,
    per_page: String(opts.perPage ?? 10),
    page: String(opts.page ?? 1),
  });

  try {
    const res = await fetch(`${JUDGEME_BASE}/reviews?${params}`, {
      headers: {Accept: 'application/json'},
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {reviews?: JudgeMeReview[]};

    return (data.reviews ?? [])
      .filter((r) => !r.hidden && (r.rating ?? 0) > 0)
      .map((r) => ({
        id: String(r.id),
        author: r.reviewer?.name ?? 'Verifizierter Kunde',
        body: r.body ?? '',
        rating: r.rating ?? 5,
        createdAt: r.created_at ?? '',
        verified: r.verified === 'buyer',
      }));
  } catch {
    return [];
  }
}

/** Fetch reviews and the aggregate rating for one Shopify product. */
export async function getProductReviewData(
  env: Env,
  productHandle: string,
  opts: {perPage?: number; page?: number} = {},
): Promise<{reviews: Review[]; summary: ReviewSummary | null}> {
  const auth = judgemeAuth(env);
  if (!auth) return {reviews: [], summary: null};

  const productParams = new URLSearchParams({
    api_token: auth.token,
    shop_domain: auth.shop,
    handle: productHandle,
  });

  try {
    const productRes = await fetch(
      `${JUDGEME_BASE}/products/-1?${productParams}`,
      {headers: {Accept: 'application/json'}},
    );
    if (!productRes.ok) return {reviews: [], summary: null};

    const {product} = (await productRes.json()) as {
      product?: JudgeMeProduct;
    };
    if (!product?.id) return {reviews: [], summary: null};

    const reviewParams = new URLSearchParams({
      api_token: auth.token,
      shop_domain: auth.shop,
      product_id: String(product.id),
      published: 'true',
      per_page: String(opts.perPage ?? 10),
      page: String(opts.page ?? 1),
    });
    const reviewsRes = await fetch(`${JUDGEME_BASE}/reviews?${reviewParams}`, {
      headers: {Accept: 'application/json'},
    });
    if (!reviewsRes.ok) return {reviews: [], summary: null};

    const data = (await reviewsRes.json()) as {reviews?: JudgeMeReview[]};
    const reviews = (data.reviews ?? [])
      .filter((review) => !review.hidden && (review.rating ?? 0) > 0)
      .map((review) => ({
        id: String(review.id),
        author: review.reviewer?.name ?? 'Verifizierter Kunde',
        body: review.body ?? '',
        rating: review.rating ?? 5,
        createdAt: review.created_at ?? '',
        verified: review.verified === 'buyer',
      }));
    const summary =
      typeof product.rating === 'number' && (product.reviews_count ?? 0) > 0
        ? {
            averageRating: Math.round(product.rating * 100) / 100,
            totalCount: product.reviews_count!,
          }
        : null;

    return {reviews, summary};
  } catch {
    return {reviews: [], summary: null};
  }
}
/**
 * Aggregate rating for the reviews header + JSON-LD structured data.
 * Judge.me exposes shop-level counts via the widget settings endpoint; if the
 * call fails we return null and the UI should hide the aggregate line rather
 * than show fabricated numbers.
 */
export async function getReviewSummary(
  env: Env,
): Promise<ReviewSummary | null> {
  const auth = judgemeAuth(env);
  if (!auth) return null;

  const params = new URLSearchParams({
    api_token: auth.token,
    shop_domain: auth.shop,
  });

  try {
    const res = await fetch(
      `${JUDGEME_BASE}/widgets/product_review?${params}`,
      {
        headers: {Accept: 'application/json'},
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      average_rating?: number;
      review_count?: number;
    };
    if (typeof data.average_rating !== 'number' || !data.review_count) {
      return null;
    }
    return {
      averageRating: Math.round(data.average_rating * 100) / 100,
      totalCount: data.review_count,
    };
  } catch {
    return null;
  }
}
