/**
 * General
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getAttributesValue from '../../attributes/getAttributesValue';
import transitionDefault from '../../attributes/transitions/transitionDefault';
import getAttributeKey from '../../attributes/getAttributeKey';

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
	const { _t: transition } = props;

	if (isEmpty(transition)) return null;

	const response = {};

	Object.entries(transitionObj).forEach(([type, obj]) => {
		Object.entries(obj).forEach(([key, value]) => {
			const { hp: rawHoverProp, it: isTransform = false } = value;
			const hoverProp =
				!rawHoverProp || isArray(rawHoverProp)
					? rawHoverProp
					: [rawHoverProp];
			if (
				hoverProp &&
				hoverProp.every(
					prop =>
						!getAttributesValue({
							target: prop,
							props,
						})
				) &&
				!isTransform
			)
				return;

			const { ta: rawTarget, p: rawProperty } = value;
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
						['sc', 'rot', 'tr', 'ori'].every(
							prop =>
								!getLastBreakpointAttribute({
									target: `tr_${prop}`,
									breakpoint,
									attributes: props,
									keys: [key, 'hs'],
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
							target: '_spl',
							breakpoint,
							attributes: transition[type][key],
						});
						const transitionSplit =
							transition[type][key]?.[
								getAttributeKey({ key: '_spl', breakpoint })
							];

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
							getLastTransitionAttribute('_tdu');
						const transitionDuration =
							getTransitionAttribute('_tdu');

						const lastTransitionDelay =
							getLastTransitionAttribute('_tde');
						const transitionDelay = getTransitionAttribute('_tde');

						const lastTransitionTimingFunction =
							getLastTransitionAttribute('_ea');
						const transitionTimingFunction =
							getTransitionAttribute('_ea');

						const lastTransitionStatus =
							getLastTransitionAttribute('_ts');
						const transitionStatus = getTransitionAttribute('_ts');

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
