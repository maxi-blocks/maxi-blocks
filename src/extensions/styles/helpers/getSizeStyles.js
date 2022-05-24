/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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
			if (!obj['size-advanced-options']) {
				if (target.includes('max') || target.includes('min'))
					return null;
			}

			if (target === 'height') {
				const forceAspectRatio = getLastBreakpointAttribute({
					target: `${prefix}force-aspect-ratio`,
					breakpoint,
					attributes: obj,
				});

				if (forceAspectRatio) {
					return { 'aspect-ratio': 1, height: '100%' };
				}
			}
			if (target === 'width') {
				const fitContent = getLastBreakpointAttribute({
					target: `${prefix}width-fit-content`,
					breakpoint,
					attributes: obj,
				});

				if (fitContent) {
					return { width: 'fit-content' };
				}
			}

			if (target === 'width' || target === 'max-width') {
				const fullWidth = obj.fullWidth || false;

				if (fullWidth === 'full') {
					return null;
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
					getLastBreakpointAttribute({
						target: `${prefix}${target}-auto`,
						breakpoint,
						attributes: obj,
					});

				if (!isNil(num) && !isNil(unit))
					return { [target]: auto ? 'auto' : num + unit };
			}

			return {};
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
