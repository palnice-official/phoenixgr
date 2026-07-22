import {Link} from 'react-router';
import {config} from '~/lib/config';
import {t} from '~/lib/t';

interface FeatureGridItem {
  icon: string;
  text: string;
}

const defaultItems: FeatureGridItem[] = [
  {
    icon: '🛡️',
    text: 'Edelstahl AISI 304 — leicht, rostfrei und langlebig',
  },
  {
    icon: '💧',
    text: 'Doppeltes Filtersystem — bis zu 16 Liter pro Stunde',
  },
  {
    icon: '🦠',
    text: 'Eliminiert 99,9 % der Verunreinigungen und Schwermetalle',
  },
  {
    icon: '🚰',
    text: 'Metallhahn tropffrei — Wasser mit köstlichem Geschmack',
  },
  {
    icon: '⏳',
    text: 'Filter halten bis zu 50 % länger als Markenprodukte',
  },
  {
    icon: '🥥',
    text: 'Aktivkohle aus Kokosnussschalen eliminiert PFAS und Toxine',
  },
];

export function FeatureGrid({items}: {items?: FeatureGridItem[]}) {
  const gridItems = items?.length ? items : defaultItems;

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center font-display text-3xl font-bold text-brand-dark md:text-4xl">
          Conception für Perfektion
        </h2>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gridItems.map((item) => (
            <div
              key={item.text}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface text-3xl">
                {item.icon}
              </div>
              <p className="text-sm leading-relaxed text-neutral-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to={`/products/${config.productHandle}`}
            className="inline-block rounded-full bg-brand-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
          >
            {t.cta.tryRiskFree}
          </Link>
        </div>
      </div>
    </section>
  );
}
