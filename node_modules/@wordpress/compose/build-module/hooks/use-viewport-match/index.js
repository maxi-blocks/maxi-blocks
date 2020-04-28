/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';
/**
 * Internal dependencies
 */

import useMediaQuery from '../use-media-query';
/**
 * @typedef {"huge"|"wide"|"large"|"medium"|"small"|"mobile"} WPBreakpoint
 */

/**
 * Hash of breakpoint names with pixel width at which it becomes effective.
 *
 * @see _breakpoints.scss
 *
 * @type {Object<WPBreakpoint,number>}
 */

var BREAKPOINTS = {
  huge: 1440,
  wide: 1280,
  large: 960,
  medium: 782,
  small: 600,
  mobile: 480
};
/**
 * @typedef {">="|"<"} WPViewportOperator
 */

/**
 * Object mapping media query operators to the condition to be used.
 *
 * @type {Object<WPViewportOperator,string>}
 */

var CONDITIONS = {
  '>=': 'min-width',
  '<': 'max-width'
};
/**
 * Object mapping media query operators to a function that given a breakpointValue and a width evaluates if the operator matches the values.
 *
 * @type {Object<WPViewportOperator,Function>}
 */

var OPERATOR_EVALUATORS = {
  '>=': function _(breakpointValue, width) {
    return width >= breakpointValue;
  },
  '<': function _(breakpointValue, width) {
    return width < breakpointValue;
  }
};
var ViewportMatchWidthContext = createContext(null);
/**
 * Returns true if the viewport matches the given query, or false otherwise.
 *
 * @param {WPBreakpoint}       breakpoint      Breakpoint size name.
 * @param {WPViewportOperator} [operator=">="] Viewport operator.
 *
 * @example
 *
 * ```js
 * useViewportMatch( 'huge', '<' );
 * useViewportMatch( 'medium' );
 * ```
 *
 * @return {boolean} Whether viewport matches query.
 */

var useViewportMatch = function useViewportMatch(breakpoint) {
  var operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '>=';
  var simulatedWidth = useContext(ViewportMatchWidthContext);
  var mediaQuery = !simulatedWidth && "(".concat(CONDITIONS[operator], ": ").concat(BREAKPOINTS[breakpoint], "px)");
  var mediaQueryResult = useMediaQuery(mediaQuery);

  if (simulatedWidth) {
    return OPERATOR_EVALUATORS[operator](BREAKPOINTS[breakpoint], simulatedWidth);
  }

  return mediaQueryResult;
};

useViewportMatch.__experimentalWidthProvider = ViewportMatchWidthContext.Provider;
export default useViewportMatch;
//# sourceMappingURL=index.js.map