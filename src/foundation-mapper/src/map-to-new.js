export function mapToNew(item) {
  const objArray = item.fields.map((field) => {
    const obj = {};
    obj[field.name] = field.jsonValue;
    return obj;
  });

  const model = {};
  objArray.forEach((obj) => {
    Object.assign(model, obj);
  });

  return model;
}
