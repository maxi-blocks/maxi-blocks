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
		const getValue = (target, cssProperty) => {
			let fullWidthNormalStyles = {};

			if (target === '_w' || target === '_mw' || target === '_miw') {
				const fullWidth = getLastBreakpointAttribute({
					target: `${prefix}_fw`,
					breakpoint,
					attributes: obj,
				});

				if (
					(target === '_w' || target === '_miw') &&
					fullWidth === 'full'
				)
					return null;

				if (target === '_mw') {
					if (fullWidth === 'full')
						return {
							'min-width': '100%',
						};

					const isMinWidthNeeded = breakpoints
						.slice(0, breakpoints.indexOf(breakpoint) + 1)
						.some(bp => {
							const val = getAttributesValue({
								target: '_fw',
								breakpoint: bp,
								props: obj,
								prefix,
							});
							const defaultVal = getDefaultAttribute(
								getAttributeKey('_fw', false, prefix, bp)
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

			if (!obj[getAttributeKey('_sao', false, prefix)]) {
				if (target.includes('min')) return null;
				if (target.includes('max')) return fullWidthNormalStyles;
			}

			if (target === '_h') {
				const forceAspectRatio = getLastBreakpointAttribute({
					target: `${prefix}_far`,
					breakpoint,
					attributes: obj,
				});

				if (forceAspectRatio)
					return { 'aspect-ratio': 1, height: 'auto' };
				if (obj[getAttributeKey('fitParentSize')])
					return { height: '100% !important' };
			}
			if (target === '_w') {
				const fitContent = getLastBreakpointAttribute({
					target: `${prefix}_wfc`,
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
				target: `${target}.u`,
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
					target: `${prefix}${target}.u`,
					breakpoint,
					attributes: obj,
				});

				const auto =
					prefix === 'number-counter-' &&
					target === '_w' &&
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
						[cssProperty]: auto || num + unit,
						...fullWidthNormalStyles,
					};
			}

			return {
				...fullWidthNormalStyles,
			};
		};

		response[breakpoint] = {
			...getValue('_mw', 'max-width'),
			...getValue('_w', 'width'),
			...getValue('_miw', 'min-width'),
			...getValue('_mh', 'max-height'),
			...getValue('_h', 'height'),
			...getValue('_mih', 'min-height'),
		};
	});

	return response;
};

export default getSizeStyles;
