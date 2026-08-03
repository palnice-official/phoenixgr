interface Step {
  icon: string;
  title: string;
  body: string;
  order: number;
}

const defaultIcons = [
  '/images/homePage/icon-assemble.svg',
  '/images/homePage/icon-water-sm.svg',
  '/images/homePage/icon-glass.svg',
];

export function ThreeSteps({
  steps,
  heading = "So einfach geht's",
}: {
  steps: Step[];
  heading?: string;
}) {
  if (!steps.length) return null;

  return (
    <section className="bg-[#f7f6f3] px-6 py-16 sm:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="m-0 max-w-3xl font-sans text-[clamp(2.15rem,4vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-[#123b59]">
          {heading}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-12 lg:gap-20">
          {steps.map((step, index) => (
            <article key={`${step.order}-${step.title}`}>
              <div className="mb-5 flex h-10 items-center text-[#7fd6e7]">
                <img
                  src={step.icon || defaultIcons[index]}
                  alt=""
                  className="h-10 w-10 object-contain"
                />
              </div>
              <h3 className="m-0 mb-2 font-sans text-base font-bold leading-snug text-[#123b59]">
                {step.order || index + 1}. {step.title}
              </h3>
              <p className="m-0 max-w-sm font-sans text-base leading-[1.5] text-[#303235]">
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
