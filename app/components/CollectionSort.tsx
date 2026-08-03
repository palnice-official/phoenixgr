import {Form, useSearchParams} from 'react-router';

export const SORT_OPTIONS = [
  ['featured', 'Empfohlen'],
  ['relevance', 'Am relevantesten'],
  ['best-selling', 'Meistverkauft'],
  ['title-ascending', 'Alphabetisch, A-Z'],
  ['title-descending', 'Alphabetisch, Z-A'],
  ['price-ascending', 'Preis, niedrig zu hoch'],
  ['price-descending', 'Preis, hoch zu niedrig'],
  ['created-ascending', 'Datum, alt zu neu'],
  ['created-descending', 'Datum, neu zu alt'],
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number][0];

export function getSortOption(request: Request): SortOption {
  const value = new URL(request.url).searchParams.get('sort_by');
  return SORT_OPTIONS.some(([option]) => option === value)
    ? (value as SortOption)
    : 'featured';
}

export function CollectionSort() {
  const [searchParams] = useSearchParams();

  return (
    <Form className="collection-sort" method="get">
      <label htmlFor="collection-sort-by">
        <SortIcon />
        Sortieren nach:
      </label>
      <select
        defaultValue={searchParams.get('sort_by') || 'featured'}
        id="collection-sort-by"
        name="sort_by"
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
      >
        {SORT_OPTIONS.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </Form>
  );
}

function SortIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8 6h12M8 12h9M8 18h6M4 4v16m0 0-2.5-2.5M4 20l2.5-2.5" />
    </svg>
  );
}
