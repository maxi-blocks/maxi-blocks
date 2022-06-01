/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import transitionDefault from '../transitions/transitionDefault';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransitionStyles = (props, transitionObj = transitionDefault) => {
	const { transition } = props;

	const response = {};
	Object.entries(transitionObj).forEach(([type, obj]) => {
		Object.entries(obj).forEach(([key, value]) => {
			const {
				target: rawTarget,
				property: rawProperty,
				limitless = false,
			} = value;

			const targets = Array.isArray(rawTarget) ? rawTarget : [rawTarget];
			const properties = Array.isArray(rawProperty)
				? rawProperty
				: [rawProperty];

			targets.forEach(target => {
				const transitionContent = transition[type][key];
				if (!props[transitionContent.hoverProp]) return;

				if (isNil(response[target]))
					response[target] = { transition: {} };

				breakpoints.forEach(breakpoint => {
					let transitionString = '';

					const transitionDuration = getLastBreakpointAttribute({
						target: 'transition-duration',
						breakpoint,
						attributes: transitionContent,
					});

					const transitionDelay = getLastBreakpointAttribute({
						target: 'transition-delay',
						breakpoint,
						attributes: transitionContent,
					});

					const transitionTimingFunction = getLastBreakpointAttribute(
						{
							target: 'easing',
							breakpoint,
							attributes: transitionContent,
						}
					);

					properties.forEach(property => {
						if (
							transitionDuration ||
							transitionDelay ||
							transitionTimingFunction
						) {
							transitionString += `${
								limitless ? 'all' : property
							} ${transitionDuration}s ${transitionDelay}s ${transitionTimingFunction}, `;
						}
					});

					transitionString = transitionString.replace(/,\s*$/, '');

					if (isNil(response[target].transition[breakpoint]))
						response[target].transition[breakpoint] = {
							transition: transitionString,
						};
					else
						response[target].transition[
							breakpoint
						].transition += `, ${transitionString}`;
				});
			});
		});
	});

	return response;
};

export default getTransitionStyles;
