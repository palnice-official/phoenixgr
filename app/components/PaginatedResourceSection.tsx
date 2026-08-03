import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
  infiniteScroll = false,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  ariaLabel?: string;
  resourcesClassName?: string;
  infiniteScroll?: boolean;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? (
                'Loading...'
              ) : (
                <span>
                  <span aria-hidden="true">↑</span> Load previous
                </span>
              )}
            </PreviousLink>
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            {infiniteScroll ? (
              <InfiniteScrollNextLink
                isLoading={isLoading}
                NextLink={NextLink}
              />
            ) : (
              <NextLink>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <span>
                    Load more <span aria-hidden="true">↓</span>
                  </span>
                )}
              </NextLink>
            )}
          </div>
        );
      }}
    </Pagination>
  );
}

function InfiniteScrollNextLink({
  isLoading,
  NextLink,
}: {
  isLoading: boolean;
  NextLink: React.ElementType;
}) {
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isLoading || !linkRef.current || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        linkRef.current?.click();
      },
      {rootMargin: '600px 0px'},
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <>
      <NextLink ref={linkRef} hidden aria-hidden="true" tabIndex={-1}>
        Load more
      </NextLink>
      <div ref={sentinelRef} aria-hidden="true" />
      {isLoading && <p role="status">Loading...</p>}
    </>
  );
}
