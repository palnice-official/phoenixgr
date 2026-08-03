interface Benefit {
  text: string;
  icon: string;
}

const defaultItems: readonly Benefit[] = [
  {text: 'Less than 5 cents Per Gallon', icon: 'icon-scales.svg'},
  {text: 'No Plumbing Required', icon: 'icon-plumbing.svg'},
  {text: '50+ Years Of Experience', icon: 'icon-experience.svg'},
  {text: 'Filter Out 99.9% Of Contaminants', icon: 'icon-water-drop.svg'},
  {text: '800k Happy Customers', icon: 'icon-happy.svg'},
  {
    text: '$1,000s Cheaper Than Bottles & In-Home Systems',
    icon: 'icon-bottle.svg',
  },
];

export function BenefitsMarquee({
  items = defaultItems,
}: {
  items?: readonly Benefit[];
}) {
  if (!items.length) return null;

  const list = (duplicate = false) => (
    <ul aria-hidden={duplicate || undefined} className="feature-benefits-list">
      {items.map(({text, icon}) => (
        <li className="feature-benefits-item" key={`${text}-${icon}`}>
          <img
            src={`/images/homePage/feature-icons/${icon}`}
            alt=""
            loading="lazy"
          />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section
      className="feature-benefits-marquee"
      aria-label="Phoenix Gravity benefits"
    >
      <div className="feature-benefits-track">
        {list()}
        {list(true)}
      </div>
    </section>
  );
}
