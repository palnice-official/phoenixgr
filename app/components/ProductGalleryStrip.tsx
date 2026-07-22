interface Image {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export function ProductGalleryStrip({images}: {images: Image[]}) {
  if (!images.length) return null;

  return (
    <section className="bg-surface px-5 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-10 text-center font-display text-3xl font-bold text-brand-dark md:text-4xl">
          Entdecken Sie den Phoenix
        </h2>

        {/* Scroll-snap gallery */}
        <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {images.map((image, index) => (
            <li
              key={image.url}
              className="w-[80%] shrink-0 snap-center sm:w-[45%] lg:w-[30%]"
            >
              <div className="aspect-square overflow-hidden rounded-2xl">
                <img
                  src={image.url}
                  alt={image.altText || `Produktbild ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}