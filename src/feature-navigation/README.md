# Constellation Feature Navigation

## Installation

```bash
npm install @constellation4sitecore/feature-navigation --save
```

## Setup Serialization

In your project add in `sitecore.json`

```json
  "modules": [
    ....
    "npm:@constellation4sitecore/feature-navigation"
  ],
```

Then you can push the items by

```bash
dotnet sitecore ser push
```

## Usage

If you want to get navigation links from Link Group you can do the following:

```ts
const links = await getNavLinks(group.id);
```
