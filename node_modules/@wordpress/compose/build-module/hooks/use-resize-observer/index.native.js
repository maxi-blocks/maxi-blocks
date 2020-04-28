import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { createElement } from "@wordpress/element";

/**
 * External dependencies
 */
import { View, StyleSheet } from 'react-native';
/**
 * WordPress dependencies
 */

import { useState, useCallback } from '@wordpress/element';
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
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      measurements = _useState2[0],
      setMeasurements = _useState2[1];

  var onLayout = useCallback(function (_ref) {
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
  var observer = createElement(View, {
    style: StyleSheet.absoluteFill,
    onLayout: onLayout
  });
  return [observer, measurements];
};

export default useResizeObserver;
//# sourceMappingURL=index.native.js.map