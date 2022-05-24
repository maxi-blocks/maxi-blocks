/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

const properties = [
	{
		target: 'border',
		property: 'border',
	},
	{
		target: 'box shadow',
		property: 'box-shadow',
	},
	{
		target: 'button background',
		property: 'background',
	},
];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransitionStyles = (obj, type, rawTargets) => {
	if (!rawTargets) return null;

	const { transition } = obj;
	const targets = !Array.isArray(rawTargets) ? [rawTargets] : rawTargets;

	const transitionObj = targets.map(target => {
		const property = properties.find(
			property => property.target === target
		)?.property;

		return {
			...transition[type][target],
			property,
		};
	});

	const response = {};
	breakpoints.forEach(breakpoint => {
		let transitionString = '';
		transitionObj.forEach(obj => {
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
				transitionString += `${transitionDuration}s ${transitionDelay}s ${transitionTimingFunction} ${
					obj.property || ''
				}, `;
			}
		});

		transitionString = transitionString.replace(/,\s*$/, '');

		response[breakpoint] = {
			transition: transitionString,
		};
	});

	return response;
};

export default getTransitionStyles;
