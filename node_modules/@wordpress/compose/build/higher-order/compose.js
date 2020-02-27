"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

/**
 * External dependencies
 */

/**
 * Composes multiple higher-order components into a single higher-order component. Performs right-to-left function
 * composition, where each successive invocation is supplied the return value of the previous.
 *
 * @param {...Function} hocs The HOC functions to invoke.
 *
 * @return {Function} Returns the new composite function.
 */
var _default = _lodash.flowRight;
exports.default = _default;
//# sourceMappingURL=compose.js.map