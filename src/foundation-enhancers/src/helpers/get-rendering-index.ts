import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';

export type RenderingIndex = {
  rendering: ComponentRendering;
  index: number;
};

export function getRenderingIndex(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theObject: any | any[],
  uid: unknown,
  componentName: string,
  index?: number
): RenderingIndex | null {
  let result = null;
  if (theObject instanceof Array) {
    const filteredList = [];
    for (const placeholder of theObject) {
      // Exclude experience editor placeholders from the list
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ph = placeholder as any;
      if (ph.name != 'code') {
        filteredList.push(placeholder);
      }
    }
    for (let i = 0; i < filteredList.length; i++) {
      result = getRenderingIndex(filteredList[i], uid, componentName, i);
      if (result != null) return result;
    }
  } else {
    for (const prop in theObject) {
      if (prop == 'uid' && theObject['componentName'] == componentName) {
        if (theObject[prop] == uid) {
          return { rendering: theObject, index: index ?? 0 };
        }
      }
      if (theObject[prop] instanceof Object || theObject[prop] instanceof Array)
        result = getRenderingIndex(theObject[prop], uid, componentName);
      if (result != null) return result;
    }
  }
  return result;
}
