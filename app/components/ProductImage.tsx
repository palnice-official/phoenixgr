import {useState} from 'react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type ProductImageProps = {
  image: ProductVariantFragment['image'];
  images?: GalleryImage[];
};

export function ProductImage({image, images}: ProductImageProps) {
  const allImages = images?.length ? images : image ? [image] : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  const currentImage = allImages[selectedIndex] ?? image;

  const visibleThumbnails = Array.from(
    {length: Math.min(4, allImages.length)},
    (_, offset) => {
      const index = (selectedIndex + offset) % allImages.length;
      return {image: allImages[index], index};
    },
  );
  if (!currentImage) {
    return <div className="product-image-empty" />;
  }

  return (
    <div className="product-gallery">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="product-gallery-thumbs">
          {visibleThumbnails.map(({image: img, index}) => (
            <button
              key={img.id}
              className={`product-gallery-thumb ${
                index === selectedIndex ? 'active' : ''
              }`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Bild ${index + 1}`}
            >
              <Image
                alt={img.altText || `Vorschaubild ${index + 1}`}
                aspectRatio="1/1"
                data={img}
                sizes="80px"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="product-gallery-main">
        <Image
          alt={currentImage.altText || 'Produktbild'}
          data={currentImage}
          key={currentImage.id}
          sizes="(min-width: 45em) 50vw, 100vw"
        />
      </div>
    </div>
  );
}
