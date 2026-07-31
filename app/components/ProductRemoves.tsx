import {useId} from 'react';

interface ProductRemovesProps {
  heading: string;
  items: readonly string[];
  resultText?: string;
}

const icons = [
  '/images/ProductRemoves/icon-marquee-1_1.png',
  '/images/ProductRemoves/icon-metals.png',
  '/images/ProductRemoves/icon-marquee-3_1.png',
  '/images/ProductRemoves/icon-chlorine.png',
  '/images/ProductRemoves/icon-marquee-2_21405555-03c3-4a4a-aa04-0b2cf8724dce.png',
];

export function ProductRemoves({
  heading,
  items,
  resultText = 'bis zu 99,9 %',
}: ProductRemovesProps) {
  const headingId = useId();

  const list = (duplicate = false) => (
    <ul aria-hidden={duplicate || undefined} className="product-removes-list">
      {items.map((item, index) => (
        <li
          className="product-removes-item"
          key={`${duplicate ? 'duplicate' : 'original'}-${item}`}
        >
          <span className="product-removes-icon">
            <img alt="" loading="lazy" src={icons[index % icons.length]} />
          </span>
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
