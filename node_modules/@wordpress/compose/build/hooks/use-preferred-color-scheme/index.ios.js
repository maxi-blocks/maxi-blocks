"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNativeDarkMode = require("react-native-dark-mode");

/**
 * External dependencies
 */
// Conditional needed to pass UI Tests on CI
if (_reactNativeDarkMode.eventEmitter.setMaxListeners) {
  _reactNativeDarkMode.eventEmitter.setMaxListeners(150);
}
/**
 * Returns the color scheme value when it changes. Possible values: [ 'light', 'dark' ]
 *
 * @return {string} return current color scheme.
 */


var usePreferredColorScheme = _reactNativeDarkMode.useDarkModeContext;
var _default = usePreferredColorScheme;
exports.default = _default;
//# sourceMappingURL=index.ios.js.map