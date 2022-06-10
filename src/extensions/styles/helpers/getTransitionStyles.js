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

					const getLastTransitionAttribute = target =>
						getLastBreakpointAttribute({
							target,
							breakpoint,
							attributes: transitionContent,
						});

					const getTransitionAttribute = target =>
						transitionContent[`${target}-${breakpoint}`];

					const lastTransitionDuration = getLastTransitionAttribute(
						'transition-duration'
					);
					const transitionDuration = getTransitionAttribute(
						'transition-duration'
					);

					const lastTransitionDelay =
						getLastTransitionAttribute('transition-delay');
					const transitionDelay =
						getTransitionAttribute('transition-delay');

					const lastTransitionTimingFunction =
						getLastTransitionAttribute('easing');
					const transitionTimingFunction =
						getTransitionAttribute('easing');

					const transitionStatus =
						getLastTransitionAttribute('transition-status');

					properties.forEach(property => {
						const transitionProperty = limitless ? 'all' : property;
						const isSomeValue =
							transitionDuration ||
							transitionDelay ||
							transitionTimingFunction;

						if (transitionStatus && isSomeValue) {
							transitionString += `${transitionProperty} ${lastTransitionDuration}s ${lastTransitionDelay}s ${lastTransitionTimingFunction}, `;
						} else if (isSomeValue) {
							transitionString += `${transitionProperty} 0s 0s, `;
						}
					});

					transitionString = transitionString.replace(/,\s*$/, '');

					if (transitionString)
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
