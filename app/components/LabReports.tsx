interface LabReport {
  image: string;
  label: string;
  pdf: string;
}

export function LabReports({
  reports,
  heading = 'Laborberichte & Zertifizierungen',
}: {
  reports: LabReport[];
  heading?: string;
}) {
  if (!reports.length) return null;

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-brand-dark md:text-4xl">
          {heading}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {reports.map((report) => (
            <a
              key={report.pdf}
              href={report.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-neutral-200 transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={report.image}
                  alt={report.label}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-brand-dark">
                  {report.label}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  PDF herunterladen
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
