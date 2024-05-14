# Constellation Enhancers

## Installation

```bash
npm install @constellation4sitecore/enhancers --save
```

## Usage

### With DatasourceRendering

Similarly to `withDatasourceCheck` that comes OOTB to enforce a component to have a Datasource, we created a new High-Order component called `withDatasourceRendering` that is meant to help developers code faster by automatically checking for a Datasource if available, if not the datasource will fallback to the context item.

```tsx
import { withDatasourceRendering } from '@constellation4sitecore/enhancers';

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

### Modify Children Properties when using Placeholders

For example you want to send properties to a child component that is inserted into a Placeholder.

```tsx
const MyComponent = ({ fields, params, rendering }: MyComponentProps) => {
  useModifyChildrenProps(rendering, {
    myProp1: fields.myProp1,
    myProp2: 'hello world!',
  });

  return (
    <Placeholder
      name={`my-chindren-modules-${params.DynamicPlaceholderId}`}
      rendering={rendering}
    />
  );
};
```

Note: This serves as a workaround in cases where `modifyComponentProps` prop in the `Placeholder` Component fails to function properly. This issue arises due to the `component-props.ts` plugin overriding the props through the `getStaticProps` method.
