import {Form, useActionData, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/product-registration';
import {adminGraphql} from '~/lib/shopify-admin.server';

const METAOBJECT_TYPE = 'product_registration';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
type ActionData = {ok: boolean; error?: string};

// Add, remove, rename, or reorder text fields here.
const TEXT_FIELDS = [
  {name: 'vendor_name', label: 'Vendor Name', type: 'text', required: false},
  {name: 'name', label: 'Name', type: 'text', required: true},
  {name: 'phone', label: 'Phone', type: 'tel', required: true},
  {name: 'email', label: 'Email', type: 'email', required: true},
] as const;

const COUNTRIES = [
  'Germany',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Austria',
  'Switzerland',
  'Other',
];

export function meta() {
  return [
    {title: 'Product Registration | Phoenix'},
    {
      name: 'description',
      content: 'Register your Phoenix product and purchase invoice.',
    },
  ];
}

function RegistrationFields({
  products,
}: {
  products: {id: string; title: string}[];
}) {
  return (
    <div>
      <Field label="Product Name" htmlFor="product" required>
        <select id="product" name="product" required defaultValue="">
          <option value="" disabled>
            Select a product
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </Field>
      <TextFields />
      <InvoiceAndConsent />
    </div>
  );
}

function TextFields() {
  return (
    <>
      {TEXT_FIELDS.map((field) => (
        <Field
          key={field.name}
          label={field.label}
          htmlFor={field.name}
          required={field.required}
        >
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            required={field.required}
            autoComplete={
              field.name === 'name'
                ? 'name'
                : field.name === 'phone'
                  ? 'tel'
                  : field.name === 'email'
                    ? 'email'
                    : 'organization'
            }
          />
        </Field>
      ))}
      <Field label="Country" htmlFor="country" required>
        <select id="country" name="country" required defaultValue="Germany">
          {COUNTRIES.map((country) => (
            <option key={country}>{country}</option>
          ))}
        </select>
      </Field>
    </>
  );
}

function InvoiceAndConsent() {
  return (
    <>
      <Field label="Purchase Invoice" htmlFor="purchase_invoice" required>
        <input
          id="purchase_invoice"
          name="purchase_invoice"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          required
        />
        <small>PDF, JPG, or PNG. Maximum 10 MB.</small>
      </Field>
      <label className="registration-checkbox">
        <input name="contact_consent" type="checkbox" required />
        <span>
          You allow us to contact you regarding your registration (we’ll only
          use your data for this purpose). <b aria-hidden="true">*</b>
        </span>
      </label>
      <label className="registration-checkbox">
        <input name="marketing_consent" type="checkbox" />
        <span>Would you like to receive marketing materials from us?</span>
      </label>
    </>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="registration-field">
      <label htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

async function ensureDefinition(env: Env) {
  const existing = await adminGraphql<{
    metaobjectDefinitions: {nodes: {type: string}[]};
  }>(env, METAOBJECT_DEFINITIONS);
  if (
    existing.metaobjectDefinitions.nodes.some(
      ({type}) => type === METAOBJECT_TYPE,
    )
  ) {
    return;
  }
  const result = await adminGraphql<{
    metaobjectDefinitionCreate: {
      metaobjectDefinition: {type: string} | null;
      userErrors: {message: string}[];
    };
  }>(env, CREATE_DEFINITION, {definition: REGISTRATION_DEFINITION});
  const errors = result.metaobjectDefinitionCreate.userErrors;
  if (
    errors.length &&
    !errors.some(({message}) => message.includes('already exists'))
  ) {
    throw new Error(errors.map(({message}) => message).join(', '));
  }
}

async function uploadInvoice(env: Env, file: File) {
  const staged = await adminGraphql<{
    stagedUploadsCreate: {
      stagedTargets: {
        url: string;
        resourceUrl: string;
        parameters: {name: string; value: string}[];
      }[];
      userErrors: {message: string}[];
    };
  }>(env, STAGE_UPLOAD, {
    input: [
      {
        filename: file.name,
        mimeType: file.type,
        fileSize: String(file.size),
        resource: 'FILE',
        httpMethod: 'POST',
      },
    ],
  });
  const errors = staged.stagedUploadsCreate.userErrors;
  const target = staged.stagedUploadsCreate.stagedTargets[0];
  if (errors.length || !target) {
    throw new Error(errors.map(({message}) => message).join(', '));
  }

  const body = new FormData();
  target.parameters.forEach(({name, value}) => body.append(name, value));
  body.append('file', file);
  const response = await fetch(target.url, {method: 'POST', body});
  if (!response.ok) throw new Error('Invoice upload failed');
  return createFile(env, target.resourceUrl, file.name);
}

async function createFile(env: Env, originalSource: string, filename: string) {
  const created = await adminGraphql<{
    fileCreate: {files: {id: string}[]; userErrors: {message: string}[]};
  }>(env, CREATE_FILE, {
    files: [
      {
        originalSource,
        contentType: 'FILE',
        filename,
        alt: 'Purchase invoice',
      },
    ],
  });
  const errors = created.fileCreate.userErrors;
  const id = created.fileCreate.files[0]?.id;
  if (errors.length || !id) {
    throw new Error(errors.map(({message}) => message).join(', '));
  }
  return id;
}

export async function loader({context}: Route.LoaderArgs) {
  const {products} = await context.storefront.query(PRODUCTS_QUERY);
  return {products: products.nodes};
}

export async function action({request, context}: Route.ActionArgs) {
  try {
    const form = await request.formData();
    if (form.get('website')) return {ok: true};

    const value = (key: string) => String(form.get(key) || '').trim();
    const product = value('product');
    const email = value('email');
    const country = value('country');
    const invoice = form.get('purchase_invoice');

    if (
      !product ||
      !email ||
      !country ||
      TEXT_FIELDS.some((field) => field.required && !value(field.name)) ||
      form.get('contact_consent') !== 'on'
    ) {
      return Response.json(
        {ok: false, error: 'Please complete all required fields.'},
        {status: 400},
      );
    }
    if (!email.includes('@')) {
      return Response.json(
        {ok: false, error: 'Please enter a valid email address.'},
        {status: 400},
      );
    }
    if (!(invoice instanceof File) || invoice.size === 0) {
      return Response.json(
        {ok: false, error: 'Please attach your purchase invoice.'},
        {status: 400},
      );
    }
    if (
      invoice.size > MAX_FILE_SIZE ||
      !ALLOWED_FILE_TYPES.includes(invoice.type)
    ) {
      return Response.json(
        {ok: false, error: 'Invoice must be a PDF, JPG, or PNG under 10 MB.'},
        {status: 400},
      );
    }

    await ensureDefinition(context.env);
    const invoiceId = await uploadInvoice(context.env, invoice);
    const result = await adminGraphql<{
      metaobjectCreate: {
        metaobject: {id: string} | null;
        userErrors: {message: string}[];
      };
    }>(context.env, CREATE_REGISTRATION, {
      metaobject: {
        type: METAOBJECT_TYPE,
        values: {
          product,
          ...Object.fromEntries(
            TEXT_FIELDS.map((field) => [field.name, value(field.name)]),
          ),
          country,
          purchase_invoice: invoiceId,
          contact_consent: 'true',
          marketing_consent: String(form.get('marketing_consent') === 'on'),
          submitted_at: new Date().toISOString(),
        },
      },
    });
    const errors = result.metaobjectCreate.userErrors;
    if (errors.length || !result.metaobjectCreate.metaobject) {
      throw new Error(errors.map(({message}) => message).join(', '));
    }
    return {ok: true};
  } catch (error) {
    console.error('Product registration failed', error);
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error &&
          error.message === 'SHOPIFY_ADMIN_API_TOKEN is not configured'
            ? 'Product registration is not configured yet.'
            : 'We could not save your registration. Please try again.',
      },
      {status: 500},
    );
  }
}

export default function ProductRegistration() {
  const {products} = useLoaderData<typeof loader>();
  const actionData = useActionData() as ActionData | undefined;
  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  return (
    <section className="registration-page">
      <div className="registration-card">
        <header>
          <p className="registration-eyebrow">Phoenix warranty</p>
          <h1>Product Registration</h1>
          <p>Register your product and keep your purchase details together.</p>
        </header>

        {actionData?.ok ? (
          <div className="registration-success" role="status">
            <h2>Thank you — your product is registered.</h2>
            <p>Your registration is now available in Shopify Admin.</p>
          </div>
        ) : (
          <Form method="post" encType="multipart/form-data">
            <div className="registration-honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <RegistrationFields products={products} />
            {actionData?.error ? (
              <p className="registration-error" role="alert">
                {actionData.error}
              </p>
            ) : null}
            <button
              className="registration-submit"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </Form>
        )}
      </div>
    </section>
  );
}

const REGISTRATION_DEFINITION = {
  name: 'Product registration',
  type: METAOBJECT_TYPE,
  fieldDefinitions: [
    {
      name: 'Product',
      key: 'product',
      type: 'product_reference',
      required: true,
    },
    ...TEXT_FIELDS.map(({name, label, required}) => ({
      name: label,
      key: name,
      type: 'single_line_text_field',
      required,
    })),
    {
      name: 'Country',
      key: 'country',
      type: 'single_line_text_field',
      required: true,
    },
    {
      name: 'Purchase Invoice',
      key: 'purchase_invoice',
      type: 'file_reference',
      required: true,
    },
    {
      name: 'Contact Consent',
      key: 'contact_consent',
      type: 'boolean',
      required: true,
    },
    {
      name: 'Marketing Consent',
      key: 'marketing_consent',
      type: 'boolean',
      required: true,
    },
    {
      name: 'Submitted At',
      key: 'submitted_at',
      type: 'date_time',
      required: true,
    },
  ],
};

const PRODUCTS_QUERY = `#graphql
  query RegistrationProducts {
    products(first: 100, sortKey: TITLE) { nodes { id title } }
  }
` as const;

const METAOBJECT_DEFINITIONS = `
  query ProductRegistrationDefinitions {
    metaobjectDefinitions(first: 250) { nodes { type } }
  }
`;

const CREATE_DEFINITION = `
  mutation CreateProductRegistrationDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition { type }
      userErrors { message }
    }
  }
`;

const STAGE_UPLOAD = `
  mutation StageRegistrationInvoice($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets { url resourceUrl parameters { name value } }
      userErrors { message }
    }
  }
`;

const CREATE_FILE = `
  mutation CreateRegistrationInvoice($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files { id }
      userErrors { message }
    }
  }
`;

const CREATE_REGISTRATION = `
  mutation CreateProductRegistration($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
      metaobject { id }
      userErrors { message }
    }
  }
`;
