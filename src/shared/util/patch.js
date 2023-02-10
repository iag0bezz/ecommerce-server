/* eslint-disable @typescript-eslint/no-var-requires */
// require('dotenv').config();

/* eslint-disable no-prototype-builtins */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable func-names */
/* eslint-disable no-extend-native */
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());

  return int ?? this.toString();
};

Object.prototype.normalize = function () {
  for (const prop in this) {
    const value = this[prop];
    const type = typeof value;
    if (
      value != null &&
      (type === 'string' || type === 'object') &&
      this.hasOwnProperty(prop)
    ) {
      if (type === 'object') {
        obj[prop].normalize();
      } else {
        this[prop] = this[prop].trim();
      }
    }
  }
};
