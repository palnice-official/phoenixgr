import {useState} from 'react';

interface AccordionItem {
  title: string;
  content: string;
}

export function ProductAccordion({items}: {items: AccordionItem[]}) {
  if (!items.length) return null;

  return (
    <div className="product-accordions">
      {items.map((item) => (
        <AccordionItemComponent key={item.title} item={item} />
      ))}
    </div>
  );
}

function AccordionItemComponent({item}: {item: AccordionItem}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`product-accordion ${open ? 'open' : ''}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="product-accordion-trigger"
        >
          {item.title}
          <span className="product-accordion-icon" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div
        className="product-accordion-content"
        role="region"
        hidden={!open}
        dangerouslySetInnerHTML={{__html: item.content}}
      />
    </div>
  );
}
