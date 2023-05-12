# Constellation Foundation Labels

## Installation
1. Nuget Install
```powershell
nuget {Package}
```
2. NPM Installation
```powershell
npm i @constellation4sitecore/foundation-labels --save
```

## Building the library
### Generate Items as Resource
```powershell
dotnet sitecore itemres create -o Constellation.XmCloud.Foundation.Labels/App_Data/items/master/ConstellationFoundationLabels -i Constellation.Foundation.Labels
```

## Usage
```typescript
getLabelsForView<Model>(id);
```