export function getRenderingIndex(theObject, uid, componentName, index = null) {
  let result = null;
  if (theObject instanceof Array) {
    for (let i = 0; i < theObject.length; i++) {
      result = getRenderingIndex(theObject[i], uid, componentName, i);
      if (result != null) return result;
    }
  } else {
    for (const prop in theObject) {
      if (prop == 'uid' && theObject['componentName'] == componentName) {
        if (theObject[prop] == uid) {
          return { object: theObject, index: index };
        }
      }
      if (theObject[prop] instanceof Object || theObject[prop] instanceof Array)
        result = getRenderingIndex(theObject[prop], uid, componentName);
      if (result != null) return result;
    }
  }
  return result;
}
