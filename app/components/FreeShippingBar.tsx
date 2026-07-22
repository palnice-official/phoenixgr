// app/components/FreeShippingBar.tsx
// -----------------------------------------------------------------------------
// Cart-drawer progress bar toward free shipping (AI_CONTEXT.md §7 CartAside).
// Usage inside the cart aside:
//   <FreeShippingBar
//     subtotal={Number(cart?.cost?.subtotalAmount?.amount ?? 0)}
//   />
// Threshold lives in config so dev/prod and future promos need no code change.
// -----------------------------------------------------------------------------
import {config, formatEUR} from '~/lib/config';
import {t} from '~/lib/t';

export function FreeShippingBar({subtotal}: {subtotal: number}) {
  const threshold = config.freeShippingThresholdEUR;
  const remaining = Math.max(0, threshold - subtotal);
  const unlocked = remaining <= 0;
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="border-b border-neutral-200 px-5 py-4">
      <p
        aria-live="polite"
        className={`mb-2 text-sm font-medium ${
          unlocked ? 'text-emerald-700' : 'text-neutral-800'
        }`}
      >
        {unlocked
          ? t.cart.freeShippingUnlocked
          : t.cart.freeShippingRemaining(formatEUR(remaining))}
      </p>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={t.cart.title}
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            unlocked ? 'bg-emerald-600' : 'bg-brand-blue'
          }`}
          style={{width: `${pct}%`}}
        />
      </div>
    </div>
  );
}
