interface ComparisonRow {
  label: string;
  phoenix: boolean;
  other_systems: boolean;
  bottled: boolean;
  pitchers: boolean;
}

export function ComparisonTable({
  rows,
  heading = 'Warum Phoenix?',
}: {
  rows: ComparisonRow[];
  heading?: string;
}) {
  if (!rows.length) return null;

  return (
    <section className="bg-white px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-brand-dark md:text-4xl">
          {heading}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="py-4 text-left text-sm font-semibold text-neutral-600">
                  Merkmal
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-brand-blue">
                  Phoenix
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600">
                  Andere Systeme
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600">
                  Flaschenwasser
                </th>
                <th className="px-4 py-4 text-center text-sm font-semibold text-neutral-600">
                  Filterkannen
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className="py-4 text-sm text-neutral-800">{row.label}</td>
                  <td className="px-4 py-4 text-center">
                    <CheckIcon checked={row.phoenix} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <CheckIcon checked={row.other_systems} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <CheckIcon checked={row.bottled} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <CheckIcon checked={row.pitchers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({checked}: {checked: boolean}) {
  return checked ? (
    <svg
      className="mx-auto h-6 w-6 text-green-500"
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
  ) : (
    <svg
      className="mx-auto h-6 w-6 text-neutral-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
