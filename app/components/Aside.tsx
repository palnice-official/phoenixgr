import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useId} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id,
  type,
}: {
  children?: React.ReactNode;
  id?: string;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const abortController = new AbortController();
    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (expanded) {
      const focusable = () =>
        Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        );
      focusable()[0]?.focus();
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
          if (event.key === 'Tab') {
            const items = focusable();
            const first = items[0];
            const last = items.at(-1);
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => {
      abortController.abort();
      if (expanded) previouslyFocused?.focus();
    };
  }, [close, expanded]);

  return (
    <div
      aria-modal
      aria-hidden={!expanded}
      className={`overlay overlay-${type} ${expanded ? 'expanded' : ''}`}
      id={id}
      ref={dialogRef}
      role="dialog"
      aria-labelledby={headingId}
    >
      <button
        className="close-outside"
        onClick={close}
        aria-label="Schließen"
      />
      <aside className={`aside-${type}`}>
        <header>
          <h3 id={headingId}>{heading}</h3>
          <button
            className="close reset"
            onClick={close}
            aria-label="Schließen"
          >
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
