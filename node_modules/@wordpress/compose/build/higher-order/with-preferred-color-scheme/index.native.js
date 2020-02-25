"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _createHigherOrderComponent = _interopRequireDefault(require("../../utils/create-higher-order-component"));

var _usePreferredColorScheme = _interopRequireDefault(require("../../hooks/use-preferred-color-scheme"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var withPreferredColorScheme = (0, _createHigherOrderComponent.default)(function (WrappedComponent) {
  return function (props) {
    var colorScheme = (0, _usePreferredColorScheme.default)();
    var isDarkMode = colorScheme === 'dark';

    var getStyles = function getStyles(lightStyles, darkStyles) {
      var finalDarkStyles = _objectSpread({}, lightStyles, {}, darkStyles);

      return isDarkMode ? finalDarkStyles : lightStyles;
    };

    return (0, _element.createElement)(WrappedComponent, (0, _extends2.default)({
      preferredColorScheme: colorScheme,
      getStylesFromColorScheme: getStyles
    }, props));
  };
}, 'withPreferredColorScheme');
var _default = withPreferredColorScheme;
exports.default = _default;
//# sourceMappingURL=index.native.js.map