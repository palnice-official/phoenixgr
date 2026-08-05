const ADMIN_API_VERSION = '2026-07';

type AdminEnv = Env & {SHOPIFY_ADMIN_API_TOKEN?: string};

export async function adminGraphql<T>(
  env: AdminEnv,
  query: string,
  variables: Record<string, unknown> = {},
) {
  if (!env.SHOPIFY_ADMIN_API_TOKEN) {
    throw new Error('SHOPIFY_ADMIN_API_TOKEN is not configured');
  }

  const response = await fetch(
    `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_API_TOKEN,
      },
      body: JSON.stringify({query, variables}),
    },
  );
  const json = (await response.json()) as {
    data?: T;
    errors?: {message: string}[];
  };

  if (!response.ok || json.errors?.length || !json.data) {
    throw new Error(
      json.errors?.map(({message}) => message).join(', ') ||
        `Shopify Admin API returned ${response.status}`,
    );
  }

  return json.data;
}
