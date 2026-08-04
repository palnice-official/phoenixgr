import {useAnalytics, useNonce} from '@shopify/hydrogen';
import {useEffect} from 'react';

export function TidioChat({publicKey}: {publicKey: string}) {
  const {customerPrivacy} = useAnalytics();
  const nonce = useNonce();

  useEffect(() => {
    const load = () => {
      if (
        !/^[a-z0-9]+$/i.test(publicKey) ||
        !customerPrivacy?.marketingAllowed() ||
        document.getElementById('tidio-chat')
      )
        return;

      const script = document.createElement('script');
      script.id = 'tidio-chat';
      script.async = true;
      script.src = `https://code.tidio.co/${publicKey}.js`;
      if (nonce) script.nonce = nonce;
      document.body.appendChild(script);
    };

    load();
    document.addEventListener('visitorConsentCollected', load);
    return () => document.removeEventListener('visitorConsentCollected', load);
  }, [customerPrivacy, nonce, publicKey]);

  return null;
}
