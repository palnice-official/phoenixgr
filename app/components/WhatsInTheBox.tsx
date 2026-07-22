import {Link} from 'react-router';
import {t} from '~/lib/t';
import {config} from '~/lib/config';

interface BoxItem {
  text: string;
}

export function WhatsInTheBox({items, imageUrl}: {items: BoxItem[]; imageUrl?: string}) {
  if (!items.length) return null;

  return (
    <section className="bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-12 md:flex-row">
          {/* Content */}
          <div className="w-full md:w-1/2">
            <h2 className="mb-6 font-display text-3xl font-bold text-brand-dark md:text-4xl">
              Was ist in der Box?
            </h2>
            <p className="mb-6 text-lg text-neutral-600">
              Alles, was Sie für sofortiges, reines Trinkwasser benötigen:
            </p>
            <ul className="mb-8 space-y-3">
              {items.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
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
                  <span className="text-neutral-600">{item.text}</span>
                </li>
              ))}
            </ul>
            <Link
              to={`/products/${config.productHandle}`}
              className="inline-block rounded-full bg-brand-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
            >
              {t.cta.orderNow}
            </Link>
          </div>

          {/* Image */}
          {imageUrl && <div className="w-full md:w-1/2">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <img
                src={imageUrl}
                alt="Lieferumfang des Phoenix Wasserfilters"
                className="h-full w-full object-cover"
              />
            </div>
          </div>}
        </div>
      </div>
    </section>
  );
}
