# Constellation Data

## Installation

```bash
npm install @constellation4sitecore/data --save
```

## Usage

Our data library simplifies the process of retrieving Sitecore items without the need to create a GraphQL endpoint manually. It seamlessly utilizes the GraphQL endpoint in the background, saving you from the hassle of writing complex GraphQL code yourself.

### Get Item

```ts
await getItem(itemId);
```

### Derived From

```ts
await derivedFrom(itemId, 'BASE TEMPLATE ID');
```

### Get Template Info

```ts
await getTemplateInfo(itemId);
```

## Credits

### Sponsors/Developers/Testers

(in no particular order)

- Richard Cabral
- Roberto Armas
