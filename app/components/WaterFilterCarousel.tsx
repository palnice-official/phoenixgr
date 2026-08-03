import {useRef, useState} from 'react';

export type WaterFilterSlide = {
  src: string;
  alt: string;
};

const defaultSlides: WaterFilterSlide[] = [
  {
    src: '/images/homePage/feature-icons/water-filter-eCom1.jpg',
    alt: 'Phoenix Wasserfilter in einer modernen K\u00fcche',
  },
  {
    src: '/images/homePage/feature-icons/water-filter-eCom2.jpg',
    alt: 'Phoenix Wasserfiltersystem im Einsatz',
  },
  {
    src: '/images/homePage/feature-icons/water-filter-eCom3.jpg',
    alt: 'Gefiltertes Wasser aus dem Phoenix Wasserfilter',
  },
  {
    src: '/images/homePage/feature-icons/water-filter-eCom4.png',
    alt: 'Phoenix Wasserfilter Produktansicht',
  },
];

export function WaterFilterCarousel({
  slides = defaultSlides,
}: {
  slides?: WaterFilterSlide[];
}) {
  const carouselRef = useRef<HTMLUListElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const goTo = (index: number) => {
    carouselRef.current?.scrollTo({
      left: index * carouselRef.current.clientWidth,
      behavior: 'smooth',
    });
  };

  const move = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const currentSlide = Math.round(carousel.scrollLeft / carousel.clientWidth);
    const nextSlide =
      (currentSlide + direction + slides.length) % slides.length;
    goTo(nextSlide);
  };

  return (
    <section
      aria-label="Phoenix Wasserfilter Bildergalerie"
      className="bg-white px-4 py-10 sm:px-8 md:py-16"
    >
      <div className="relative mx-auto max-w-7xl">
        <ul
          ref={carouselRef}
          onScroll={(event) =>
            setActiveSlide(
              Math.round(
                event.currentTarget.scrollLeft /
                  event.currentTarget.clientWidth,
              ),
            )
          }
          className="m-0 flex snap-x snap-mandatory overflow-x-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide, index) => (
            <li
              key={slide.src}
              className="m-0 aspect-video w-full shrink-0 snap-center overflow-hidden rounded-2xl"
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="h-full w-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
                width="1920"
                height="1080"
              />
            </li>
          ))}
        </ul>
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Vorheriges Bild"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-brand-dark shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark md:left-5"
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>
            <button
              type="button"
              aria-label={'N\u00e4chstes Bild'}
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl text-brand-dark shadow-md transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark md:right-5"
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Bild ${index + 1} anzeigen`}
                  aria-current={index === activeSlide ? 'true' : undefined}
                  onClick={() => goTo(index)}
                  className="group grid size-6 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-dark"
                >
                  <span
                    className={`size-2.5 rounded-full transition ${
                      index === activeSlide
                        ? 'bg-brand-dark'
                        : 'bg-gray-400 group-hover:bg-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
