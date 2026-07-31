// app/components/AnnouncementBar.tsx
// -----------------------------------------------------------------------------
// Infinite horizontal marquee of short trust messages (AI_CONTEXT.md §6.1).
// Messages come from `announcement` metaobjects (queried in root loader) so
// marketing can edit them in admin without a deploy.
//
// Technique: the track is rendered twice; a keyframe animation translates the
// wrapper by -50%, which loops seamlessly. Pauses on hover; respects
// prefers-reduced-motion by showing a static row instead.
// -----------------------------------------------------------------------------
import {t} from '~/lib/t';

export function AnnouncementBar({messages}: {messages: string[]}) {
  if (!messages.length) return null;

  const track = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-12 pr-12"
    >
      {messages.map((msg) => (
        <li
          key={`${ariaHidden ? 'b' : 'a'}-${msg}`}
          className="whitespace-nowrap text-xs font-medium uppercase tracking-wider"
        >
          {msg}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      aria-label={t.a11y.announcement}
      className="announcement-bar group overflow-hidden"
    >
      {/* Scoped keyframes; alternatively move into tailwind.config.ts */}
      <style>{`
        @keyframes ann-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ann-track {
          animation: ann-marquee 28s linear infinite;
        }
        .group:hover .ann-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .ann-track { animation: none; }
        }
      `}</style>
      <div className="ann-track flex w-max py-2">
        {track(false)}
        {track(true)}
      </div>
    </aside>
  );
}
