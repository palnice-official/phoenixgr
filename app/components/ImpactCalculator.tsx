// app/components/ImpactCalculator.tsx
// -----------------------------------------------------------------------------
// Interactive "environmental impact" widget (AI_CONTEXT.md §6.5).
// Pure client-side math — no API calls. All assumptions live in
// config.impact and are disclosed in the footnote for transparency.
// -----------------------------------------------------------------------------
import {useState} from 'react';
import {Link} from 'react-router';
import {config, formatEUR} from '~/lib/config';
import {t} from '~/lib/t';

const nf = new Intl.NumberFormat(config.locale);

export function ImpactCalculator() {
  const {impact} = config;
  const [people, setPeople] = useState<number>(impact.defaultPeople);

  const litresPerYear = people * impact.litresPerPersonPerDay * 365;
  const bottles = people * impact.bottlesPerPersonPerYear;
  const co2Kg = Math.round(bottles * impact.co2KgPerBottle);
  const savedEur = Math.round(bottles * impact.savingsEurPerBottle);

  const step = (delta: number) =>
    setPeople((p) =>
      Math.min(impact.maxPeople, Math.max(impact.minPeople, p + delta)),
    );

  return (
    <section className="bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-blue">
          {t.impact.eyebrow}
        </p>
        <h2 className="mb-10 font-display text-3xl md:text-5xl">
          {t.impact.heading}
        </h2>

        {/* Household size stepper */}
        <div className="mb-10 flex items-center justify-center gap-5">
          <span className="text-base md:text-lg">{t.impact.question}</span>
          <div className="flex items-center gap-3 rounded-full border border-neutral-300 bg-white px-3 py-1.5">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={people <= impact.minPeople}
              aria-label={t.impact.decrease}
              className="h-8 w-8 rounded-full text-xl leading-none hover:bg-neutral-100 disabled:opacity-30"
            >
              −
            </button>
            <output className="min-w-[7.5rem] font-semibold" aria-live="polite">
              {t.impact.people(people)}
            </output>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={people >= impact.maxPeople}
              aria-label={t.impact.increase}
              className="h-8 w-8 rounded-full text-xl leading-none hover:bg-neutral-100 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <dl className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard value={nf.format(bottles)} label={t.impact.bottlesAvoided} />
          <StatCard value={nf.format(co2Kg)} label={t.impact.co2Avoided} />
          <StatCard value={nf.format(savedEur)} label={t.impact.moneySaved} />
        </dl>

        {/* Usage vs capacity */}
        <div className="mx-auto mb-10 max-w-xl divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white text-left">
          <Row
            label={t.impact.estimatedUsage}
            value={t.impact.usageValue(nf.format(litresPerYear))}
          />
          <Row label={t.impact.capacityLabel} value={t.impact.capacityValue} />
        </div>

        <Link
          to={`/products/${config.productHandle}`}
          className="inline-block rounded-full bg-brand-blue px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:opacity-90"
        >
          {t.cta.orderNow}
        </Link>

        <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-neutral-500">
          {t.impact.footnote}
        </p>
      </div>
    </section>
  );
}

function StatCard({value, label}: {value: string; label: string}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6">
      <dd className="font-display text-4xl font-semibold text-brand-dark">
        {value}
      </dd>
      <dt className="mt-1 text-sm text-neutral-600">{label}</dt>
    </div>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
