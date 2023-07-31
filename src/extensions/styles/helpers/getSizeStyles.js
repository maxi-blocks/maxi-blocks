/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getDefaultAttribute from '../getDefaultAttribute';

/**
 * External dependencies
 */
import { isNumber, isNil } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getSizeStyles = (obj, prefix = '') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const getValue = target => {
			let fullWidthNormalStyles = {};
			if (
				target === 'width' ||
				target === 'max-width' ||
				target === 'min-width'
			) {
				const fullWidth = getLastBreakpointAttribute({
					target: `${prefix}full-width`,
					breakpoint,
					attributes: obj,
				});

				if (
					(target === 'width' || target === 'min-width') &&
					fullWidth
				) {
					return null;
				}

				if (target === 'max-width') {
					if (fullWidth) {
						return {
							'min-width': '100%',
						};
					}

					const isMinWidthNeeded = breakpoints
						.slice(0, breakpoints.indexOf(breakpoint) + 1)
						.some(bp => {
							const val = obj[`${prefix}full-width-${bp}`];
							const defaultVal = getDefaultAttribute(
								`${prefix}full-width-${bp}`
							);

							return val !== defaultVal;
						});

					if (!fullWidth && isMinWidthNeeded) {
						fullWidthNormalStyles = {
							'min-width': 'initial',
						};
					}
				}
			}

			if (!obj[`${prefix}size-advanced-options`]) {
				if (target.includes('min')) return null;
				if (target.includes('max')) return fullWidthNormalStyles;
			}

			if (target === 'height') {
				const forceAspectRatio = getLastBreakpointAttribute({
					target: `${prefix}force-aspect-ratio`,
					breakpoint,
					attributes: obj,
				});

				if (forceAspectRatio)
					return { 'aspect-ratio': 1, height: 'auto !important' };
				if (obj.fitParentSize) return { height: '100% !important' };
			}
			if (target === 'width') {
				const fitContent = getLastBreakpointAttribute({
					target: `${prefix}width-fit-content`,
					breakpoint,
					attributes: obj,
				});

				if (fitContent) {
					return {
						width: 'fit-content',
					};
				}
			}

			if (
				isNumber(parseInt(obj[`${prefix}${target}-${breakpoint}`])) ||
				obj[`${prefix}${target}-unit-${breakpoint}`]
			) {
				const num = getLastBreakpointAttribute({
					target: `${prefix}${target}`,
					breakpoint,
					attributes: obj,
				});
				const unit = getLastBreakpointAttribute({
					target: `${prefix}${target}-unit`,
					breakpoint,
					attributes: obj,
				});

				const auto =
					prefix === 'number-counter-' &&
					target === 'width' &&
					obj['number-counter-circle-status']
						? 'auto'
						: getLastBreakpointAttribute({
								target: `${prefix}${target}-auto`,
								breakpoint,
								attributes: obj,
						  }) && '100%';

				if (!isNil(num) && !isNil(unit))
					return {
						[target]: auto || num + unit,
						...fullWidthNormalStyles,
					};
			}

			return {
				...fullWidthNormalStyles,
			};
		};

		response[breakpoint] = {
			...getValue('max-width'),
			...getValue('width'),
			...getValue('min-width'),
			...getValue('max-height'),
			...getValue('height'),
			...getValue('min-height'),
		};
	});

	return response;
};

export default getSizeStyles;
