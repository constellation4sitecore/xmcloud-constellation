interface IItem {
  fields: any;
}

export function castItem<T>(item: IItem): T | null {
  return item.fields;
}
