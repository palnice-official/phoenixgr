# Shopify PDP content setup

Hydrogen owns the section markup. Shopify owns the product-specific content and
the order in which sections appear. Create these merchant-owned definitions in
**Settings → Custom data** and enable Storefront access for every definition.

## 1. Product and variant metafields

| Owner   | Namespace/key             | Type                                         | Purpose                                                           |
| ------- | ------------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| Product | `custom.pdp_sections`     | List of mixed references                     | Ordered PDP sections; allow the `pdp_*` section definitions below |
| Product | `custom.page_template`    | Single-line text                             | Existing fallback: `water-filter` or `replacement-filter`         |
| Variant | `custom.gallery`          | List of file references (images)             | Existing variant gallery override                                 |
| Variant | `custom.specifications`   | Rich text                                    | Buy-box technical specifications override                         |
| Variant | `custom.filtration_steps` | List of metaobject references to `step_item` | Overrides steps in a `pdp_steps` section                          |

## 2. Section metaobjects

Field keys must match exactly. Fields not marked required may be left empty.

| Definition          | Fields                                                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pdp_feature_split` | `heading` single-line (required), `body` rich text, `image` file, `images` list of files, `image_side` single-line (`left`/`right`), `image_alt`, `cta_text`, `cta_link` URL |
| `pdp_contaminants`  | `heading` single-line (required), `result_text` single-line, `items` list of references to `contaminant_item`                                                                |
| `pdp_steps`         | `heading` single-line, `items` list of references to `step_item`                                                                                                             |
| `pdp_comparison`    | `heading` single-line, `rows` list of references to `comparison_row`                                                                                                         |
| `pdp_benefit_grid`  | `heading` single-line, `items` list of references to `benefit_item`, `show_cta` boolean                                                                                      |
| `pdp_guarantee`     | `heading` single-line, `body` rich text, `image` file, `image_alt` single-line, `terms_link` URL                                                                             |
| `pdp_lab_reports`   | `heading` single-line, `reports` list of references to `lab_report`                                                                                                          |
| `pdp_faq`           | `heading` single-line, `items` list of references to `faq_item`                                                                                                              |
| `pdp_reviews`       | `heading` single-line                                                                                                                                                        |
| `pdp_gallery`       | `heading` single-line, `images` list of files; product media is used when empty                                                                                              |

## 3. Item metaobjects

| Definition         | Fields                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| `contaminant_item` | `label` single-line (required)                                              |
| `step_item`        | Existing fields: `icon` file, `title`, `body`, `order` integer              |
| `comparison_row`   | Existing fields: `label`, `phoenix`, `other_systems`, `bottled`, `pitchers` |
| `benefit_item`     | `icon` file or `emoji` single-line, `text` multi-line (required)            |
| `lab_report`       | Existing fields: `image` file, `label`, `pdf` file                          |
| `faq_item`         | `question` single-line (required), `answer` rich text (required)            |

## 4. Populate a product

1. Create item entries such as steps, FAQs, benefits, comparison rows, and reports.
2. Create section entries and attach their item entries.
3. Open the product and add section entries to `custom.pdp_sections` in display order.
4. Add variant specifications, filtration-step overrides, or galleries only where they differ.
5. Preview the Hydrogen PDP. If `custom.pdp_sections` is empty, the existing
   `custom.page_template` fallback renders instead.

Use Shopify translations for German content when another market is introduced.
Do not publish filtration, certification, health, warranty, or savings claims
until their German-market wording and evidence have been approved.
