import type {ButtonHTMLAttributes, ReactNode} from 'react';
import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

type AddToCartButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'type'
> & {
  analytics?: unknown;
  children?: ReactNode;
  lines: Array<OptimisticCartLineInput>;
  pendingLabel?: ReactNode;
};

export function AddToCartButton({
  analytics,
  children = 'ADD TO CART',
  className,
  disabled,
  lines,
  pendingLabel = children,
  ...buttonProps
}: AddToCartButtonProps) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isPending = fetcher.state !== 'idle';

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              {...buttonProps}
              type="submit"
              className={['add-to-cart-button', className]
                .filter(Boolean)
                .join(' ')}
              disabled={disabled || isPending}
              aria-busy={isPending}
            >
              {isPending ? pendingLabel : children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
