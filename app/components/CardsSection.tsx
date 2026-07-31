interface Card {
  icon: string;
  iconAlt?: string;
  title: string;
  description: string;
}

export function CardsSection({
  cards,
  heading = "It's never been this easy to enjoy safe, delicious drinking water every single day of the year!",
  backgroundImage,
}: {
  cards: Card[];
  heading?: string;
  backgroundImage?: string;
}) {
  if (!cards.length) return null;

  return (
    <section
      className={`relative overflow-hidden px-5 py-16 md:py-24 ${
        backgroundImage ? 'bg-cover bg-center' : 'bg-surface'
      }`}
      style={
        backgroundImage
          ? {backgroundImage: `url("${backgroundImage}")`}
          : undefined
      }
    >

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex justify-center md:mb-14">
          <h2 className="text-center font-display text-3xl font-bold text-brand-dark md:text-4xl lg:max-w-4xl">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden md:h-24 md:w-24">
                <img
                  src={card.icon}
                  alt={card.iconAlt ?? ''}
                  width="400"
                  height="400"
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-brand-dark">
                {card.title}
              </h3>
              <p className="leading-7 text-neutral-600">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
