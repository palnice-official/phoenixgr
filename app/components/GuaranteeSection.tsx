import {Link} from 'react-router';
import {t} from '~/lib/t';
import {config} from '~/lib/config';
import type {ReactNode} from 'react';

export function GuaranteeSection({
  imageUrl,
  imageAlt = '100 Tage Geld-zurück-Garantie',
  heading = '100 Tage Geld-zurück-Garantie',
  body,
  termsLink,
}: {
  imageUrl?: string;
  imageAlt?: string;
  heading?: string;
  body?: ReactNode;
  termsLink?: string;
}) {
  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          {/* Image */}
          {imageUrl && (
            <div className="w-full md:w-1/2">
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="w-full md:w-1/2">
            <h2 className="mb-6 font-display text-3xl font-bold text-brand-dark md:text-4xl">
              {heading}
            </h2>
            <div className="mb-6 text-lg leading-relaxed text-neutral-600">
              {body || (
                <p>
                  Wir sind so überzeugt von der Qualität unseres Wasserfilters,
                  dass wir Ihnen eine uneingeschränkte
                  100-Tage-Geld-zurück-Garantie bieten. Testen Sie den Phoenix
                  ohne Risiko — wenn Sie nicht zufrieden sind, erstatten wir
                  Ihnen den vollen Kaufpreis.
                </p>
              )}
            </div>
            <ul className="mb-8 space-y-3">
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-neutral-600">
                  100 Tage unbedenklich testen
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-neutral-600">
                  Volle Rückerstattung des Kaufpreises
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-neutral-600">
                  Kostenloser Rückversand
                </span>
              </li>
            </ul>
            <Link
              to={`/products/${config.productHandle}`}
              className="inline-block rounded-full bg-brand-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
            >
              {t.cta.tryRiskFree}
            </Link>
            {termsLink && (
              <Link className="ml-4 text-sm underline" to={termsLink}>
                Garantiebedingungen
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
