# Constellation Navigation

## Installation

```bash
npm install @constellation4sitecore/navigation --save
```

## Setup Serialization

In your project add in `sitecore.json`

```json
  "modules": [
    ....
    "npm:@constellation4sitecore/navigation"
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

### Sponsors/Developers/Testers

(in no particular order)

- Richard Cabral
- Roberto Armas
- Sebastián Aliaga
