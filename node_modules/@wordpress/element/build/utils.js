"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEmptyElement = void 0;

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * Checks if the provided WP element is empty.
 *
 * @param {*} element WP element to check.
 * @return {boolean} True when an element is considered empty.
 */
var isEmptyElement = function isEmptyElement(element) {
  if ((0, _lodash.isNumber)(element)) {
    return false;
  }

  if ((0, _lodash.isString)(element) || (0, _lodash.isArray)(element)) {
    return !element.length;
  }

  return !element;
};

exports.isEmptyElement = isEmptyElement;
//# sourceMappingURL=utils.js.map