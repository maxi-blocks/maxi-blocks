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
import { isArray, isEmpty, isEqual, isNil } from 'lodash';

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getTransitionStyles = (props, transitionObj = transitionDefault) => {
	const { transition } = props;

	if (isEmpty(transition)) return null;

	const response = {};

	Object.entries(transitionObj).forEach(([type, obj]) => {
		Object.entries(obj).forEach(([key, value]) => {
			const { hoverProp: rawHoverProp } = value;
			const hoverProp =
				!rawHoverProp || isArray(rawHoverProp)
					? rawHoverProp
					: [rawHoverProp];
			if (hoverProp && hoverProp.every(prop => !props[prop])) return;

			const { target: rawTarget, property: rawProperty } = value;
			const targets = isArray(rawTarget) ? rawTarget : [rawTarget];
			const properties = isArray(rawProperty)
				? rawProperty
				: [rawProperty];

			const transitionContent = transition[type][key];
			const split = !!transitionContent?.split;

			targets.forEach(target => {
				if (isNil(response[target]))
					response[target] = { transition: {} };

				const hoverTarget = `${target}:hover`;
				if (split && isNil(response[hoverTarget]))
					response[hoverTarget] = { transition: {} };

				breakpoints.forEach(breakpoint => {
					const generateTransitionString = (
						target,
						isHover = false
					) => {
						const transitionContent =
							isHover || !split
								? transition[type][key]
								: transition[type][key]?.out;

						let transitionString = '';

						const getLastTransitionAttribute = target =>
							getLastBreakpointAttribute({
								target,
								breakpoint,
								attributes: transitionContent,
							});

						const getTransitionAttribute = target =>
							transitionContent?.[`${target}-${breakpoint}`];

						const lastTransitionDuration =
							getLastTransitionAttribute('transition-duration');
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

						const lastTransitionStatus =
							getLastTransitionAttribute('transition-status');
						const transitionStatus =
							getTransitionAttribute('transition-status');

						properties.forEach(property => {
							const transitionProperty = property || 'all';
							const isSomeValue =
								isEqual(
									transitionDuration,
									lastTransitionDuration
								) ||
								isEqual(transitionDelay, lastTransitionDelay) ||
								isEqual(
									transitionTimingFunction,
									lastTransitionTimingFunction
								) ||
								isEqual(transitionStatus, lastTransitionStatus);

							if (isSomeValue)
								if (!lastTransitionStatus) {
									transitionString += `${transitionProperty} 0s 0s, `;
								} else if (lastTransitionStatus) {
									transitionString += `${transitionProperty} ${lastTransitionDuration}s ${lastTransitionDelay}s ${lastTransitionTimingFunction}, `;
								}
						});

						transitionString = transitionString.replace(
							/,\s*$/,
							''
						);

						if (transitionString)
							if (isNil(response[target].transition[breakpoint]))
								response[target].transition[breakpoint] = {
									transition: transitionString,
								};
							else
								response[target].transition[
									breakpoint
								].transition += `, ${transitionString}`;
					};

					generateTransitionString(target);
					if (split) generateTransitionString(hoverTarget, true);
				});
			});
		});
	});

	return response;
};

export default getTransitionStyles;
