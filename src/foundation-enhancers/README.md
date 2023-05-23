# Constellation Foundation Mapper

## Installation

```bash
npm install @constellation4sitecore/foundation-enhancers --save
```

## Usage

### With DatasourceRendering

Similarly to `withDatasourceCheck` that comes OOTB to enforce a component to have a Datasource, we created a new High-Order component called `withDatasourceRendering` that is meant to help developers code faster by automatically checking for a Datasource if available, if not the datasource will fallback to the context item.

```tsx
import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';

export default withDatasourceRendering()<HomepageMastheadProps>(HomepageMasthead);
```

This pattern takes the Component and validates if the rendering has any datasource to return fields as normal call otherwise fields will be populated with `useSitecoreContext`

### Get Rendering Index

This helper function allows you to get index of the rendering.

```ts
const placeholders = layoutData.sitecore?.route?.placeholders;
const result = getRenderingIndex(placeholders, rendering.uid as string, 'TabbedContentRowTab');
```

Inputs:

- placeholders: all layout placeholders
- UID: Rendering UID
- Component Name: Name of the child component.

### Filter Placeholders

For example if you want to build a Tab Content Row component, you will facing an issue, if you don't filter placeholders in experience editor it will trought an error to avoid this filterPlaceholders will filter just components that name are not equal to "code".

```ts
export const getStaticProps = async (rendering: ComponentRendering) => {
  const newTabs = [] as TabViewModel[];
  const tabContentRows = filterPlaceholders(
    (rendering.placeholders as unknown as TabbedPlaceholders).TabbedContentRowTabs
  );
  for (const tabContentRow of tabContentRows) {
  }
};
```
