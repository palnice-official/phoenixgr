import {useRef, useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

type GalleryImage = {
  mediaType?: 'image';
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type GalleryVideo = {
  mediaType: 'video';
  id: string;
  url: string;
  poster: string;
  altText?: string | null;
};

type GalleryMedia = GalleryImage | GalleryVideo;

type ProductImageProps = {
  image: ProductVariantFragment['image'];
  images?: GalleryMedia[];
};

export function ProductImage({image, images}: ProductImageProps) {
  const fallbackImage: GalleryImage | null = image
    ? {...image, mediaType: 'image'}
    : null;
  const allImages: GalleryMedia[] = images?.length
    ? images
    : fallbackImage
      ? [fallbackImage]
      : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStart = useRef<number | null>(null);

  const currentImage = allImages[selectedIndex] ?? fallbackImage;
  const visibleThumbnails = Array.from(
    {length: Math.min(4, allImages.length)},
    (_, offset) => {
      const index = (selectedIndex + offset) % allImages.length;
      return {image: allImages[index], index};
    },
  );
  const selectPrevious = () =>
    setSelectedIndex(
      (index) => (index - 1 + allImages.length) % allImages.length,
    );
  const selectNext = () =>
    setSelectedIndex((index) => (index + 1) % allImages.length);

  if (!currentImage) {
    return <div className="product-image-empty" />;
  }

  return (
    <div className="product-gallery">
      <div
        className="product-gallery-main"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance =
            (event.changedTouches[0]?.clientX ?? touchStart.current) -
            touchStart.current;
          if (Math.abs(distance) > 40) {
            if (distance > 0) selectPrevious();
            else selectNext();
          }
          touchStart.current = null;
        }}
      >
        {currentImage.mediaType === 'video' ? (
          <video
            aria-label={currentImage.altText || 'Produktvideo'}
            autoPlay
            key={currentImage.id}
            loop
            muted
            playsInline
            poster={currentImage.poster}
            preload="metadata"
          >
            <source src={currentImage.url} type="video/mp4" />
          </video>
        ) : (
          <Image
            alt={currentImage.altText || 'Produktbild'}
            data={currentImage}
            key={currentImage.id || currentImage.url}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        )}
        {allImages.length > 1 && (
          <>
            <GalleryArrow
              direction="previous"
              label="Vorheriges Produktbild"
              onClick={selectPrevious}
            />
            <GalleryArrow
              direction="next"
              label="Nächstes Produktbild"
              onClick={selectNext}
            />
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <>
          <div className="product-gallery-dots">
            {allImages.map((img, index) => (
              <button
                type="button"
                key={img.id || img.url}
                className={index === selectedIndex ? 'active' : ''}
                onClick={() => setSelectedIndex(index)}
                aria-label={`Bild ${index + 1} anzeigen`}
                aria-current={index === selectedIndex}
              />
            ))}
          </div>

          <div className="product-gallery-thumbs">
            {visibleThumbnails.map(({image: img, index}) => (
              <button
                type="button"
                key={img.id || img.url}
                className={`product-gallery-thumb ${
                  index === selectedIndex ? 'active' : ''
                }`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`Bild ${index + 1} anzeigen`}
                aria-current={index === selectedIndex}
              >
                {img.mediaType === 'video' ? (
                  <img
                    alt={img.altText || `Videovorschau ${index + 1}`}
                    src={img.poster}
                    loading="lazy"
                  />
                ) : (
                  <Image
                    alt={img.altText || `Vorschaubild ${index + 1}`}
                    aspectRatio="1/1"
                    data={img}
                    sizes="(min-width: 45em) 25vw, 80px"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GalleryArrow({
  direction,
  label,
  onClick,
}: {
  direction: 'previous' | 'next';
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`product-gallery-arrow ${direction}`}
      aria-label={label}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d={direction === 'previous' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}
        />
      </svg>
    </button>
  );
}
