import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain:
        context.env.PUBLIC_CHECKOUT_DOMAIN ?? context.env.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://code.tidio.co',
    ],
    connectSrc: [
      'https://sentry-new.tidio.co',
      'https://socket.tidio.co',
      'wss://socket.tidio.co',
      'https://uploads.tidio.com',
    ],
    imgSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://cdnjs.cloudflare.com',
      'https://unpkg.com',
      'data:',
      'https://code.tidio.co',
      'https://avatars.tidiochat.com',
      'https://tidio-images-messenger.s3.us-east-1.amazonaws.com',
    ],
    mediaSrc: ["'self'", 'https://cdn.shopify.com', 'https://code.tidio.co'],
    fontSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://code.tidio.co',
      'data:',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
