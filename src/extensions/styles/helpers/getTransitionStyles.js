/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransitionStyles = obj => {
	const response = {};

	if (obj['transition-status'])
		breakpoints.forEach(breakpoint => {
			const transitionDuration = getLastBreakpointAttribute({
				target: 'transition-duration',
				breakpoint,
				attributes: obj,
			});

			const transitionDelay = getLastBreakpointAttribute({
				target: 'transition-delay',
				breakpoint,
				attributes: obj,
			});

			const transitionTimingFunction = getLastBreakpointAttribute({
				target: 'easing',
				breakpoint,
				attributes: obj,
			});

			if (
				transitionDuration ||
				transitionDelay ||
				transitionTimingFunction
			) {
				response[breakpoint] = {
					transition: `${transitionDuration}s ${transitionDelay}s ${transitionTimingFunction}`,
				};
			}
		});

	return response;
};

export default getTransitionStyles;
