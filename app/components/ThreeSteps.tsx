interface Step {
  icon: string;
  title: string;
  body: string;
  order: number;
}

export function ThreeSteps({steps}: {steps: Step[]}) {
  if (!steps.length) return null;

  return (
    <section className="bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-brand-dark md:text-4xl">
          So einfach geht&apos;s
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-blue">
                {step.icon ? (
                  <img
                    src={step.icon}
                    alt=""
                    className="h-10 w-10"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {step.order || index + 1}
                  </span>
                )}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-brand-dark">
                {step.title}
              </h3>
              <p className="text-neutral-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}