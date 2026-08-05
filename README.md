# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [React Router](https://reactrouter.com/), the modern multi-strategy router for React. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with React Router](https://reactrouter.com/start/framework/routing)

## What's included

- React Router
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 22.x or 24.x

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

npx shopify hydrogen login --shop "vf60g5-gc"

  # Display storefronts and confirm the target
  npx shopify hydrogen list

  # Relink this project to the new store's phonixgr storefront
  npx shopify hydrogen link --force --storefront "phonixgr"

  # Confirm available Oxygen environments
  npx shopify hydrogen env list

  # Test the production build
  npm run build

  # Upload/deploy to Production
  npx shopify hydrogen deploy --force --env production

  When the last command asks:

  Continue?

  Choose Yes, confirm deploy.

  Optional verification:

  Get-Content -Raw .shopify/project.json

  It should contain:

  {
    "shop": "vf60g5-gc.myshopify.com",
    "storefront": {
      "id": "gid://shopify/HydrogenStorefront/1000163667",
      "title": "phonixgr"
    }
  }



  