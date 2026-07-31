const STEPS = [
  {
    image: '/images/how-it-works/fill-upper-chamber.png',
    title: 'Obere Kammer befüllen',
    body: 'Leitungswasser in die obere Edelstahlkammer füllen. Strom oder Wasserdruck werden nicht benötigt.',
  },
  {
    image: '/images/how-it-works/carbon-filtration.png',
    title: 'Aktivkohlefiltration',
    body: 'Das Wasser fließt langsam durch die Aktivkohlefilter auf Kokosnussschalenbasis.',
  },
  {
    image: '/images/how-it-works/pure-water-collected.png',
    title: 'Wasser entnehmen',
    body: 'Das gefilterte Wasser sammelt sich in der unteren Kammer und kann direkt über den Edelstahlhahn entnommen werden.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Die Technik dahinter
          </p>
          <h2 className="font-display text-3xl font-bold text-brand-dark md:text-4xl">
            So funktioniert der Phoenix
          </h2>
        </header>

        <ol className="grid list-none gap-6 p-0 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const number = String(index + 1).padStart(2, '0');

            return (
              <li
                key={step.title}
                className="relative rounded-2xl bg-white p-6 shadow-sm md:p-8"
              >
                <span
                  className="absolute right-6 top-5 font-display text-4xl font-bold text-brand-blue/15"
                  aria-hidden="true"
                >
                  {number}
                </span>
                <div className="mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-surface md:h-36 md:w-36">
                  <img
                    src={step.image}
                    alt=""
                    width="720"
                    height="720"
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
                  Schritt {number}
                </p>
                <h3 className="mb-3 text-xl font-semibold text-brand-dark">
                  {step.title}
                </h3>
                <p className="leading-7 text-neutral-600">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
