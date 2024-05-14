# Constellation Labels

This module aims to streamline the management of translatable text. While SXA offers the dictionary concept, organizing items across different locations in Sitecore can prove challenging to maintain. Hence, the Labels module introduces a dedicated template per component, allowing you to consolidate all your labels in one central location for easier management.

## Installation

```bash
npm install @constellation4sitecore/labels --save
```

## Setup Serialization

In your project add in `sitecore.json`

```json
  "modules": [
    ....
    "npm:@constellation4sitecore/labels"
  ],
```

Then you can push the items by

```bash
dotnet sitecore ser push
```

To install the SXA Module on your site, follow these steps:

- Right-click on your site.
- Navigate to "Scripts."
- Choose "Add Site Module."
- Select the 'Labels' option.
- Proceed by clicking on the "Install" button.

This process will integrate the Labels module into your site, enhancing its functionality with streamlined label management.

## Usage

1. Create a Label item in sitecore
2. Copy the created Item ID
3. In your project create a folder for labels

```ts
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export type MyLabels = {
  Logo: ImageField;
  PrimaryNavigation: Field<string>;
  copyright: Field<string>;
  socialIntroText: Field<string>;
  cookieSettings: Field<string>;
};
```

4. In staticProps you can call getLabelsForView to fetch labels

```tsx
import { LabelService } from '@constellation4sitecore/labels';

export const getStaticProps: GetStaticComponentProps = async (
  _: ComponentRendering,
  layoutData: LayoutServiceData
) => {
  const labels = await new LabelService(layoutData).getLabelsForView<MyLabels>(
    TEMPLATES.MYLABEL_TEMPLATE_ID
  );
  return { labels: labels };
};
```
