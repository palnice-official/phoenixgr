import {Link} from 'react-router';
import {config} from '~/lib/config';

export type HeroVideoProps = {
  videoUrl?: string;
  posterUrl?: string;
  heading?: string;
  description?: string;
  cta?: {label: string; to: string} | null;
};

export function HeroVideo({
  videoUrl = '/images/homePage/hero-video.mp4',
  posterUrl = '/images/homePage/hero-poster.webp',
  heading = 'Redefine your water experience with a Phoenix Gravity Water Filter',
  description = 'A new age of filtration is here. Enjoy crisp drinking water at home from just less than 5 cents per gallon.',
  cta = {
    label: 'Try it with our 100-day money-back guarantee',
    to: `/products/${config.productHandle}`,
  },
}: HeroVideoProps = {}) {
  return (
    <section className="home-hero">
      <div className="home-hero-media" aria-hidden="true">
        <video autoPlay muted loop playsInline poster={posterUrl}>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>

      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <h1>{heading}</h1>
          <p>{description}</p>
          {cta && (
            <Link className="home-hero-cta" to={cta.to}>
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
