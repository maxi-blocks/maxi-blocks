/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import getDefaultAttribute from '../../attributes/getDefaultAttribute';
import getAttributesValue from '../../attributes/getAttributesValue';

/**
 * External dependencies
 */
import { isNumber, isNil } from 'lodash';
import getAttributeKey from '../../attributes/getAttributeKey';

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
					fullWidth === 'full'
				)
					return null;

				if (target === 'max-width') {
					if (fullWidth === 'full')
						return {
							'min-width': '100%',
						};

					const isMinWidthNeeded = breakpoints
						.slice(0, breakpoints.indexOf(breakpoint) + 1)
						.some(bp => {
							const val = getAttributesValue({
								target: 'full-width',
								breakpoint: bp,
								props: obj,
								prefix,
							});
							const defaultVal = getDefaultAttribute(
								getAttributeKey('full-width', false, prefix, bp)
							);

							return val !== defaultVal;
						});

					if (fullWidth === 'normal' && isMinWidthNeeded) {
						fullWidthNormalStyles = {
							'min-width': 'initial',
						};
					}
				}
			}

			if (!obj[getAttributeKey('size-advanced-options', false, prefix)]) {
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
					return { 'aspect-ratio': 1, height: 'auto' };
				if (obj[getAttributeKey('fitParentSize')])
					return { height: '100% !important' };
			}
			if (target === 'width') {
				const fitContent = getLastBreakpointAttribute({
					target: `${prefix}width-fit-content`,
					breakpoint,
					attributes: obj,
				});

				if (fitContent)
					return {
						width: 'fit-content',
					};
			}

			const currentNum = getAttributesValue({
				target,
				prefix,
				breakpoint,
				props: obj,
			});
			const currentUnit = getAttributesValue({
				target: `${target}-unit`,
				prefix,
				breakpoint,
				props: obj,
			});

			if (isNumber(parseInt(currentNum)) || currentUnit) {
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
					getAttributesValue({
						target: 'number-counter-circle-status',
						obj,
					})
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
