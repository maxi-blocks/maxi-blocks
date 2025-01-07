/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import transitionDefault from '@extensions/styles/transitions/transitionDefault';

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
			const { hoverProp: rawHoverProp, isTransform = false } = value;
			const hoverProp =
				!rawHoverProp || isArray(rawHoverProp)
					? rawHoverProp
					: [rawHoverProp];
			if (
				hoverProp &&
				hoverProp.every(prop => !props[prop]) &&
				!isTransform
			)
				return;

			const { target: rawTarget, property: rawProperty } = value;
			const targets = isArray(rawTarget) ? rawTarget : [rawTarget];
			const properties = isArray(rawProperty)
				? rawProperty
				: [rawProperty];

			targets.forEach(target => {
				const hoverTarget = `${target}:hover`;

				breakpoints.forEach(breakpoint => {
					/**
					 * Check if there is any hover transform styles.
					 */
					if (
						isTransform &&
						['scale', 'rotate', 'translate', 'origin'].every(
							prop =>
								!getLastBreakpointAttribute({
									target: `transform-${prop}`,
									breakpoint,
									attributes: props,
									keys: [key, 'hover-status'],
								})
						)
					)
						return;

					if (isNil(response[target]))
						response[target] = { transition: {} };

					const generateTransitionString = (
						target,
						isHover = false
					) => {
						const lastTransitionSplit = getLastBreakpointAttribute({
							target: 'split',
							breakpoint,
							attributes: transition[type][key],
						});
						const transitionSplit =
							transition[type][key]?.[`split-${breakpoint}`];

						const isNewTransitionSplit =
							isEqual(transitionSplit, lastTransitionSplit) &&
							!isNil(transitionSplit);

						/**
						 * If no hover styles was created and no new transition split,
						 * then we don't need to generate transition styles for hover
						 * and duplicate normal transition styles for hover.
						 */
						if (isHover && isNil(response[target])) {
							if (!isNewTransitionSplit) return;

							response[target] = { transition: {} };
						}

						const transitionContent =
							isHover || !lastTransitionSplit
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
							isEqual(transitionStatus, lastTransitionStatus) ||
							(isHover && isNewTransitionSplit);

						if (isSomeValue) {
							properties.forEach(property => {
								const transitionProperty = property || 'all';

								if (!lastTransitionStatus) {
									transitionString += `${transitionProperty} 0s 0s, `;
								} else if (lastTransitionStatus) {
									transitionString += `${transitionProperty} ${lastTransitionDuration}s ${lastTransitionDelay}s ${lastTransitionTimingFunction}, `;
								}
							});
						}

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
					generateTransitionString(hoverTarget, true);
				});
			});
		});
	});

	return response;
};

export default getTransitionStyles;
