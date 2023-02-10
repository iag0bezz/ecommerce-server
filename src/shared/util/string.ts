/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-syntax */
export const normalize = (obj: any) => {
  // eslint-disable-next-line guard-for-in
  for (const prop in obj) {
    const value = obj[prop];
    const type = typeof value;
    if (
      value != null &&
      (type == 'string' || type == 'object') &&
      obj.hasOwnProperty(prop)
    ) {
      if (type == 'object') {
        normalize(obj[prop]);
      } else {
        obj[prop] = obj[prop].trim();
      }
    }
  }
};
