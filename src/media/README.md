# Constellation Media

Simplify the integration process with Sitecore Content Hub for seamless image optimization transformation.

## Installation

```bash
npm install @constellation4sitecore/media --save
```

## Usage

```tsx
<PictureImage
  field={image}
  transformations={{
    mobile: '4x3w60',
    desktop: '4x3w189',
  }}
  loading="lazy"
  className={styles['image-navigation-link__image']}
/>
```
