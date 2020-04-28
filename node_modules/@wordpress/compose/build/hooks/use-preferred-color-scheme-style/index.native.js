"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _usePreferredColorScheme = _interopRequireDefault(require("../use-preferred-color-scheme"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Selects which of the passed style objects should be applied depending on the
 * user's preferred color scheme.
 *
 * The "light" color schemed is assumed to be the default, and its styles are
 * always applied. The "dark" styles will always extend those defined for the
 * light case.
 *
 * @example
 * const light = { padding: 10, backgroundColor: 'white' };
 * const dark = { backgroundColor: 'black' };
 * usePreferredColorSchemeStyle( light, dark);
 * // On light mode:
 * // => { padding: 10, backgroundColor: 'white' }
 * // On dark mode:
 * // => { padding: 10, backgroundColor: 'black' }
 * @param {Object} lightStyle
 * @param {Object} darkStyle
 * @return {Object} the combined styles depending on the current color scheme
 */
var usePreferredColorSchemeStyle = function usePreferredColorSchemeStyle(lightStyle, darkStyle) {
  var colorScheme = (0, _usePreferredColorScheme.default)();
  var isDarkMode = colorScheme === 'dark';
  return isDarkMode ? _objectSpread({}, lightStyle, {}, darkStyle) : lightStyle;
};

var _default = usePreferredColorSchemeStyle;
exports.default = _default;
//# sourceMappingURL=index.native.js.map