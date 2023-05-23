# Constellation Foundation Labels

## Installation

```bash
npm install @constellation4sitecore/foundation-labels --save
```

## Setup Serialization

In your project add in `sitecore.json`

```json
  "modules": [
    ....
    "npm:@constellation4sitecore/foundation-labels"
  ],
```

Then you can push the items by

```bash
dotnet sitecore ser push
```

## Usage

1. Create a Label item in sitecore
2. Copy the created Item ID
3. In your project create a folder for labels

```ts
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export type FooterLabels = {
  Logo: ImageField;
  PrimaryNavigation: Field<string>;
  copyright: Field<string>;
  socialIntroText: Field<string>;
  cookieSettings: Field<string>;
};

export const footerLabelsId = '{399FECA6-B1D3-4534-B97D-4E01BF814228}';
```

4. In staticProps you can call getLabelsForView to fetch labels

```tsx
import { getLabelsForView } from '@constellation4sitecore/foundation-labels';

export const getStaticProps: GetStaticComponentProps = async () => {
  const labels = await getLabelsForView<FooterLabels>(footerLabelsId);
  return { labels: labels };
};
```
