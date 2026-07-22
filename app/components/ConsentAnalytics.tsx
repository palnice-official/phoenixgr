import {useAnalytics, useNonce} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function ConsentAnalytics({gtmId}: {gtmId: string}) {
  const {customerPrivacy} = useAnalytics();
  const nonce = useNonce();

  useEffect(() => {
    if (
      !gtmId ||
      !customerPrivacy?.analyticsProcessingAllowed() ||
      !customerPrivacy.marketingAllowed()
    ) return;
    if (document.getElementById('google-tag-manager')) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});

    const script = document.createElement('script');
    script.id = 'google-tag-manager';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    if (nonce) script.nonce = nonce;
    document.head.appendChild(script);
  }, [customerPrivacy, gtmId, nonce]);

  return null;
}

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}
