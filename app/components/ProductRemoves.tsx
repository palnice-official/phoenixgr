import {useId} from 'react';

interface ProductRemovesProps {
  heading: string;
  items: readonly string[];
  resultText?: string;
}

export function ProductRemoves({
  heading,
  items,
  resultText = 'bis zu 99,9 %',
}: ProductRemovesProps) {
  const headingId = useId();

  const list = (duplicate = false) => (
    <ul aria-hidden={duplicate || undefined} className="product-removes-list">
      {items.map((item) => (
        <li
          className="product-removes-item"
          key={`${duplicate ? 'duplicate' : 'original'}-${item}`}
        >
          <span aria-hidden="true">✓</span>
          <strong>{item}</strong>
          <small>{resultText}</small>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="product-removes" aria-labelledby={headingId}>
      <div className="product-removes-inner">
        <h2 id={headingId}>{heading}</h2>
        <div className="product-removes-marquee">
          <div className="product-removes-track">
            {list()}
            {list(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
