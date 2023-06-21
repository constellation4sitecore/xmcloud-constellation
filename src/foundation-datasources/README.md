# Constellation Foundation Datasources

## Installation

```bash
npm install @constellation4sitecore/foundation-datasources --save
```

## Setup Serialization

In your project add in `sitecore.json`

```json
  "modules": [
    ....
    "npm:@constellation4sitecore/foundation-datasources"
  ],
```

Then you can push the items by

```bash
dotnet sitecore ser push
```
