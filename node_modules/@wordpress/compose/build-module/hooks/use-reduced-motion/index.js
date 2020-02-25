/**
 * Internal dependencies
 */
import useMediaQuery from '../use-media-query';
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
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};
export default useReducedMotion;
//# sourceMappingURL=index.js.map