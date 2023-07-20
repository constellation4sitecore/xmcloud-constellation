type IItem = {
  fields: [{ name: string; jsonValue: any }];
};

export function mapToNew<T>(item: unknown): T | null {
  const objArray = (item as IItem).fields.map((field: any) => {
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
