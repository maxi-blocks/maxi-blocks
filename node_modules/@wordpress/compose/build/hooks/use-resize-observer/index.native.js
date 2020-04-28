"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _element = require("@wordpress/element");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _reactNative = require("react-native");

/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */

/**
 * Hook which allows to listen the resize event of any target element when it changes sizes.
 *
 * @return {Array} An array of {Element} `resizeListener` and {?Object} `sizes` with properties `width` and `height`
 *
 * @example
 *
 * ```js
 * const App = () => {
 * 	const [ resizeListener, sizes ] = useResizeObserver();
 *
 * 	return (
 * 		<View>
 * 			{ resizeListener }
 * 			Your content here
 * 		</View>
 * 	);
 * };
 * ```
 *
 */
var useResizeObserver = function useResizeObserver() {
  var _useState = (0, _element.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      measurements = _useState2[0],
      setMeasurements = _useState2[1];

  var onLayout = (0, _element.useCallback)(function (_ref) {
    var nativeEvent = _ref.nativeEvent;
    var _nativeEvent$layout = nativeEvent.layout,
        width = _nativeEvent$layout.width,
        height = _nativeEvent$layout.height;
    setMeasurements(function (prevState) {
      if (!prevState || prevState.width !== width || prevState.height !== height) {
        return {
          width: width,
          height: height
        };
      }

      return prevState;
    });
  }, []);
  var observer = (0, _element.createElement)(_reactNative.View, {
    style: _reactNative.StyleSheet.absoluteFill,
    onLayout: onLayout
  });
  return [observer, measurements];
};

var _default = useResizeObserver;
exports.default = _default;
//# sourceMappingURL=index.native.js.map