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
    <div className={`cart-shipping-bar ${unlocked ? 'is-unlocked' : ''}`}>
      <p aria-live="polite">
        {unlocked && <span className="cart-shipping-check">✓</span>}
        {unlocked
          ? t.cart.freeShippingUnlocked
          : t.cart.freeShippingRemaining(formatEUR(remaining))}
      </p>

      {!unlocked && (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label={t.cart.title}
          className="cart-shipping-progress"
        >
          <span style={{width: `${pct}%`}} />
        </div>
      )}
    </div>
  );
}
