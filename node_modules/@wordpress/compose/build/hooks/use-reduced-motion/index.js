"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _useMediaQuery = _interopRequireDefault(require("../use-media-query"));

/**
 * Internal dependencies
 */

/**
 * Whether or not the user agent is Internet Explorer.
 *
 * @type {boolean}
 */
var IS_IE = typeof window !== 'undefined' && window.navigator.userAgent.indexOf('Trident') >= 0;
/**
 * Hook returning whether the user has a preference for reduced motion.
 *
 * @return {boolean} Reduced motion preference value.
 */

var useReducedMotion = process.env.FORCE_REDUCED_MOTION || IS_IE ? function () {
  return true;
} : function () {
  return (0, _useMediaQuery.default)('(prefers-reduced-motion: reduce)');
};
var _default = useReducedMotion;
exports.default = _default;
//# sourceMappingURL=index.js.map