import type {ReactNode} from 'react';
import { Link } from 'react-router';
import { config } from '~/lib/config';

interface ComparisonRow {
  label: string;
  phoenix: boolean;
  other_systems: boolean;
  bottled: boolean;
  pitchers: boolean;
}

export function ComparisonTable({
  rows,
  cta,
  heading = 'Die bequemste und günstigste Art, zu Hause reines, sauberes Trinkwasser zu genießen',
}: {
  rows: ComparisonRow[];
  heading?: string;
  cta?: ReactNode;
}) {
  if (!rows.length) return null;

  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mx-auto mb-8 max-w-4xl text-center font-display text-3xl font-bold leading-tight text-brand-dark md:mb-12 md:text-4xl">
          {heading}
        </h2>

        <p
          id="comparison-scroll-hint"
          className="mb-3 text-center text-xs text-neutral-500 sm:hidden"
        >
          Seitlich wischen, um alle Optionen zu vergleichen
        </p>

        <div
          className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm"
          aria-describedby="comparison-scroll-hint"
        >
          <table className="w-full min-w-[46rem] border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th
                  scope="col"
                  className="sticky left-0 w-44 bg-neutral-50 px-4 py-5 text-left text-sm font-bold text-brand-dark md:w-56 md:px-6 md:text-base"
                >
                  Merkmal
                </th>
                <th
                  scope="col"
                  className="w-44 bg-brand-blue px-4 py-5 text-center text-sm font-bold leading-snug text-white md:text-base"
                >
                  Phoenix Schwerkraft-Wasserfiltersystem
                </th>
                <th
                  scope="col"
                  className="w-40 px-4 py-5 text-center text-sm font-bold leading-snug text-brand-dark md:text-base"
                >
                  Hausfiltersystem
                </th>
                <th
                  scope="col"
                  className="w-40 px-4 py-5 text-center text-sm font-bold leading-snug text-brand-dark md:text-base"
                >
                  Flaschenwasser
                </th>
                <th
                  scope="col"
                  className="w-40 px-4 py-5 text-center text-sm font-bold leading-snug text-brand-dark md:text-base"
                >
                  Filterkannen
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-neutral-200 last:border-0"
                >
                  <th
                    scope="row"
                    className="sticky left-0 bg-white px-4 py-5 text-left text-sm font-semibold text-brand-dark md:px-6 md:text-base"
                  >
                    {row.label}
                  </th>
                  <td className="bg-blue-50 px-4 py-5 text-center">
                    <CheckIcon checked={row.phoenix} />
                  </td>
                  <td className="px-4 py-5 text-center">
                    <CheckIcon checked={row.other_systems} />
                  </td>
                  <td className="px-4 py-5 text-center">
                    <CheckIcon checked={row.bottled} />
                  </td>
                  <td className="px-4 py-5 text-center">
                    <CheckIcon checked={row.pitchers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cta && <Link
              to={`/products/${config.productHandle}`}
              className="mx-auto mt-8 block w-fit rounded-full bg-brand-blue px-10 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
            >
              {cta}
            </Link>}
      </div>
    </section>
  );
}

function CheckIcon({checked}: {checked: boolean}) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-2 font-semibold ${
        checked ? 'text-emerald-700' : 'text-red-600'
      }`}
    >
      <svg
        className="h-6 w-6 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d={checked ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}
        />
      </svg>
      <span>{checked ? 'Ja' : 'Nein'}</span>
    </span>
  );
}
