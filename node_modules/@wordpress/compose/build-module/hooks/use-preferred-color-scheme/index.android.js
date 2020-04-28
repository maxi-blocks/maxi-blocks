import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

/**
 * External dependencies
 */
import { subscribePreferredColorScheme, isInitialColorSchemeDark } from 'react-native-gutenberg-bridge';
/**
 * WordPress dependencies
 */

import { useState, useEffect } from '@wordpress/element';
/**
 * Returns the color scheme value when it changes. Possible values: [ 'light', 'dark' ]
 *
 * @return {string} return current color scheme.
 */

var usePreferredColorScheme = function usePreferredColorScheme() {
  var _useState = useState(isInitialColorSchemeDark ? 'dark' : 'light'),
      _useState2 = _slicedToArray(_useState, 2),
      currentColorScheme = _useState2[0],
      setCurrentColorScheme = _useState2[1];

  useEffect(function () {
    subscribePreferredColorScheme(function (_ref) {
      var isPreferredColorSchemeDark = _ref.isPreferredColorSchemeDark;
      var colorScheme = isPreferredColorSchemeDark ? 'dark' : 'light';

      if (colorScheme !== currentColorScheme) {
        setCurrentColorScheme(colorScheme);
      }
    });
  });
  return currentColorScheme;
};

export default usePreferredColorScheme;
//# sourceMappingURL=index.android.js.map