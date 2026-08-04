export type FeatureVideoBenefit = {
  text: string;
  icon: string;
  side: 'left' | 'right';
};

export type FeatureVideoProps = {
  videoUrl?: string;
  posterUrl?: string;
  ariaLabel?: string;
  benefits?: readonly FeatureVideoBenefit[];
};

const defaultBenefits = [
  {
    text: '50+ Years Of Experience',
    icon: '/images/homePage/feature-icons/icon-experience.svg',
    side: 'left',
  },
  {
    text: 'Filter Out 99.9% Of Contaminants',
    icon: '/images/homePage/feature-icons/icon-water-drop.svg',
    side: 'right',
  },
  {
    text: 'No Plumbing Required',
    icon: '/images/homePage/feature-icons/icon-plumbing.svg',
    side: 'left',
  },
  {
    text: '800k Happy Customers',
    icon: '/images/homePage/feature-icons/icon-happy.svg',
    side: 'right',
  },
  {
    text: '$1,000s Cheaper Than Bottles & In-Home Systems',
    icon: '/images/homePage/feature-icons/icon-bottle.svg',
    side: 'left',
  },
  {
    text: 'Less than 5 cents Per Gallon',
    icon: '/images/homePage/feature-icons/icon-scales.svg',
    side: 'right',
  },
] as const satisfies readonly FeatureVideoBenefit[];

export function FeatureVideo({
  videoUrl = '/images/homePage/feature-video.mp4',
  posterUrl = '/images/homePage/feature-video-poster.jpg',
  ariaLabel = 'Vorteile des Phoenix Gravity Wasserfilters',
  benefits = defaultBenefits,
}: FeatureVideoProps = {}) {
  return (
    <section
      className="-mx-4 w-[calc(100%+2rem)] overflow-hidden bg-[#f7f6f5] p-0"
      aria-label={ariaLabel}
    >
      <div className="relative aspect-[1323/651] w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl}
          aria-hidden="true"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 hidden grid-cols-[30%_40%_30%] md:grid">
          <ul className="flex flex-col justify-center gap-[clamp(1.5rem,3vw,3.25rem)] pl-[8%]">
            {benefits
              .filter(({side}) => side === 'left')
              .map(({text, icon}) => (
                <li
                  className="flex items-center justify-end gap-[clamp(.75rem,2vw,1.5rem)]"
                  key={text}
                >
                  <span className="max-w-[10rem] text-right text-[clamp(.7rem,1.2vw,1rem)] leading-tight text-[#242329]">
                    {text}
                  </span>
                  <img
                    className="h-[clamp(1.8rem,3.2vw,2.75rem)] w-[clamp(1.8rem,3.2vw,2.75rem)] object-contain"
                    src={icon}
                    alt=""
                  />
                </li>
              ))}
          </ul>

          <div />

          <ul className="flex flex-col justify-center gap-[clamp(1.5rem,3vw,3.25rem)] pr-[8%]">
            {benefits
              .filter(({side}) => side === 'right')
              .map(({text, icon}) => (
                <li
                  className="flex items-center gap-[clamp(.75rem,2vw,1.5rem)]"
                  key={text}
                >
                  <img
                    className="h-[clamp(1.8rem,3.2vw,2.75rem)] w-[clamp(1.8rem,3.2vw,2.75rem)] object-contain"
                    src={icon}
                    alt=""
                  />
                  <span className="max-w-[10rem] text-[clamp(.7rem,1.2vw,1rem)] leading-tight text-[#242329]">
                    {text}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-5 gap-y-6 px-5 py-8 md:hidden">
        {benefits.map(({text, icon}) => (
          <li className="flex items-center gap-3" key={text}>
            <img
              className="h-9 w-9 shrink-0 object-contain"
              src={icon}
              alt=""
            />
            <span className="text-sm leading-tight text-[#242329]">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
