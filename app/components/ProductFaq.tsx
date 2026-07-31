import {useId, useState, type ReactNode} from 'react';

export interface FaqCategory {
  title: string;
  items: {question: string; answer: ReactNode}[];
}

export function ProductFaq({
  heading = 'Fragen zum Phoenix? Wir helfen gerne.',
  categories = DEFAULT_CATEGORIES,
}: {
  heading?: string;
  categories?: FaqCategory[];
}) {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  if (!categories.length) return null;

  const activeCategory = categories[activeIndex] || categories[0];
  const panelId = `${id}-panel`;

  return (
    <section className="product-faq" aria-labelledby={`${id}-heading`}>
      <div className="product-faq-inner">
        <h2 id={`${id}-heading`} className="product-faq-heading">
          {heading}
        </h2>
        <div className="product-faq-select">
          <label htmlFor={`${id}-category`}>Kategorie:</label>
          <div className="product-faq-select-wrap">
            <select
              id={`${id}-category`}
              value={activeIndex}
              onChange={(event) => setActiveIndex(Number(event.target.value))}
            >
              {categories.map((category, index) => (
                <option key={category.title} value={index}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="product-faq-layout">
          <div className="product-faq-tabs" role="tablist" aria-label="FAQ-Kategorien">
            {categories.map((category, index) => (
              <button
                key={category.title}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls={panelId}
                onClick={() => setActiveIndex(index)}
              >
                {category.title}
              </button>
            ))}
          </div>
          <div id={panelId} className="product-faq-panel" role="tabpanel">
            <h3>{activeCategory.title}</h3>
            <div className="product-faq-questions">
              {activeCategory.items.map((item) => (
                <details key={item.question}>
                  <summary>
                    <span>{item.question}</span>
                    <span className="product-faq-icon" aria-hidden="true" />
                  </summary>
                  <div className="product-faq-answer"><p>{item.answer}</p></div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEFAULT_CATEGORIES: FaqCategory[] = [
  {
    title: 'Aufbau und Pflege',
    items: [
      {
        question: 'Müssen die Aktivkohlefilter vorbereitet werden?',
        answer: 'Ja. Spülen und entlüften Sie neue Filter entsprechend der beiliegenden Anleitung, bevor Sie das erste Wasser trinken.',
      },
      {
        question: 'Kann ich das System selbst aufbauen?',
        answer: 'Ja. Der Phoenix wird ohne Spezialwerkzeug, Strom oder festen Wasseranschluss aufgebaut.',
      },
    ],
  },
  {
    title: 'Filtration',
    items: [
      {
        question: 'Wie funktioniert die Schwerkraftfiltration?',
        answer: 'Wasser fließt aus der oberen Kammer langsam durch die Aktivkohlefilter und wird anschließend in der unteren Edelstahlkammer gesammelt.',
      },
      {
        question: 'Entfernt der Phoenix Wasserhärte?',
        answer: 'Nein. Aktivkohlefilter sind nicht zur Enthärtung des Wassers vorgesehen.',
      },
    ],
  },
  {
    title: 'Versand und Rückgabe',
    items: [
      {
        question: 'Wann wird meine Bestellung versendet?',
        answer: 'Verfügbare Artikel werden in der Regel innerhalb von drei bis fünf Werktagen versendet.',
      },
      {
        question: 'Wie starte ich eine Rückgabe?',
        answer: 'Kontaktieren Sie vor dem Rückversand den Kundenservice mit Ihrer Bestellnummer. Sie erhalten anschließend die passenden Rückgabehinweise.',
      },
    ],
  },
  {
    title: 'Garantie und Abonnement',
    items: [
      {
        question: 'Wie funktioniert die 100-Tage-Probefrist?',
        answer: 'Kontaktieren Sie den Kundenservice innerhalb von 100 Tagen nach Lieferung. Maßgeblich sind die veröffentlichten Rückgabebedingungen.',
      },
      {
        question: 'Kann ich ein Filter-Abonnement ändern?',
        answer: 'Wenn für Ihre Variante ein Abonnement angeboten wird, kann es im Kundenkonto angepasst, pausiert oder gekündigt werden.',
      },
    ],
  },
];
