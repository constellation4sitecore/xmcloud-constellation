interface IItem {
  fields: any[];
}

export function mapToNew<T>(item: IItem): T | null {
  const objArray = item.fields.map((field: any) => {
    const obj = {} as any;
    obj[field.name] = field.jsonValue;
    return obj;
  });

  const model = {} as T;
  objArray.forEach((obj: any) => {
    Object.assign(model as any, obj);
  });

  return model;
}
