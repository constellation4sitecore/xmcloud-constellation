# Constellation Mapper

## Installation

```bash
npm install @constellation4sitecore/mapper --save
```

## Usage

### Map To New

This function is really useful quen you perform a Graphql query for example:

```graphql
query {
  item(path: "my-path", language: "en") {
    fields {
      name
      jsonValue
    }
  }
}
```

The structure of the current result is kind of array of fields { name, jsonvalue}. Within `mapToNew` you can cast to model object instead of looping an array of fields.

```ts
import { mapToNew } from '@constellation4sitecore/mapper';

export type MyExampleType = {
  logo: ImageField;
  primaryNavigation: Field<string>;
  copyright: Field<string>;
  socialIntroText: Field<string>;
  cookieSettings: Field<string>;
};

var fieldsProps = mapToNew<MyExampleType>(results);
```

### Cast Item

In some scenarios you have the item reference which has a fields property but you need to type the fields into a type model

```ts
import { castItem } from '@constellation4sitecore/mapper';

// Given item as
// item {
//  copyright: {
//      value: "Text"
//  }
//}

export type MyExampleType = {
  copyright: Field<string>;
};

var fieldsProps = castItem<MyExampleType>(item);
```
