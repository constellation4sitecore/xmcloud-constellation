# Constellation SXA NextJS

## Installation

```bash
npm install @constellation4sitecore/constellation-sxa-nextjs --save
```

## Prepare Solution

In order to support Netlify as well as Vercel. You need apply the following hack.
Go to `./scripts/generate-config.ts` and append the following code inside writeConfig function

```ts
function writeConfig(config: JssConfig): void {
  .....
  ...

  const configPathCjs = path.resolve('src/temp/config.cjs');
  console.log(`Writing runtime config to ${configPathCjs}`);
  fs.writeFileSync(configPathCjs, configText, { encoding: 'utf8' });
}
```

## Setup Serialization

In your project add in `sitecore.json`

```json
  "modules": [
    ....
    "npm:@constellation4sitecore/constellation-sxa-nextjs"
  ],
```

Then you can push the items by

```bash
dotnet sitecore ser push
```

### Sponsors/Developers/Testers

(in no particular order)

- Richard Cabral
- Roberto Armas
- Sebastián Aliaga
