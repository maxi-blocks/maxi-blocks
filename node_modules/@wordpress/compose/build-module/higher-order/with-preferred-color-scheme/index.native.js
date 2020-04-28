import _extends from "@babel/runtime/helpers/esm/extends";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { createElement } from "@wordpress/element";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Internal dependencies
 */
import createHigherOrderComponent from '../../utils/create-higher-order-component';
import usePreferredColorScheme from '../../hooks/use-preferred-color-scheme';
var withPreferredColorScheme = createHigherOrderComponent(function (WrappedComponent) {
  return function (props) {
    var colorScheme = usePreferredColorScheme();
    var isDarkMode = colorScheme === 'dark';

    var getStyles = function getStyles(lightStyles, darkStyles) {
      var finalDarkStyles = _objectSpread({}, lightStyles, {}, darkStyles);

      return isDarkMode ? finalDarkStyles : lightStyles;
    };

    return createElement(WrappedComponent, _extends({
      preferredColorScheme: colorScheme,
      getStylesFromColorScheme: getStyles
    }, props));
  };
}, 'withPreferredColorScheme');
export default withPreferredColorScheme;
//# sourceMappingURL=index.native.js.map