/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';
import getPaletteAttributes from '../getPaletteAttributes';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getDividerStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'Divider',
		general: {},
	};

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: 'divider-border-',
				breakpoint,
			});

		if (paletteStatus && isNumber(paletteColor))
			return {
				'border-color': getColorRGBAString({
					firstVar: 'divider-color',
					secondVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle: parentBlockStyle,
				}),
			};

		return { 'border-color': color };
	};
	breakpoints.forEach(breakpoint => {
		if (target === 'line') {
			const isHorizontal =
				getLastBreakpointAttribute({
					target: 'line-orientation',
					breakpoint,
					attributes: obj,
				}) === 'horizontal';

			const dividerBorderStyle = getLastBreakpointAttribute({
				target: 'divider-border-style',
				breakpoint,
				attributes: obj,
			});

			const dividerLineWeight = isHorizontal
				? getLastBreakpointAttribute({
						target: 'divider-border-top-width',
						breakpoint,
						attributes: obj,
				  })
				: getLastBreakpointAttribute({
						target: 'divider-border-right-width',
						breakpoint,
						attributes: obj,
				  });
			const dividerLineWeightUnit =
				getLastBreakpointAttribute({
					target: isHorizontal
						? 'divider-border-top-unit'
						: 'divider-border-right-unit',
					breakpoint,
					attributes: obj,
				}) ?? 'px';

			const dividerSize = isHorizontal
				? getLastBreakpointAttribute({
						target: 'divider-width',
						breakpoint,
						attributes: obj,
				  })
				: getLastBreakpointAttribute({
						target: 'divider-height',
						breakpoint,
						attributes: obj,
				  });
			const dividerSizeUnit =
				getLastBreakpointAttribute({
					target: 'divider-width-unit',
					breakpoint,
					attributes: obj,
				}) ?? 'px';

			response[breakpoint] = {
				...getColor(breakpoint),
				...(obj[`divider-border-radius-${breakpoint}`] &&
					obj[`divider-border-style-${breakpoint}`] === 'solid' && {
						'border-radius': '20px',
					}),

				...(isHorizontal && {
					'border-top-style': dividerBorderStyle,
					'border-right-style': 'none',
					...(!isNil(dividerLineWeight) && {
						'border-top-width': `${dividerLineWeight}${dividerLineWeightUnit}`,
						height: `${dividerLineWeight}${dividerLineWeightUnit}`,
					}),
					...(!isNil(dividerSize) && {
						width: `${dividerSize}${dividerSizeUnit}`,
					}),
				}),

				...(!isHorizontal && {
					'border-top-style': 'none',
					'border-right-style': dividerBorderStyle,
					...(!isNil(dividerLineWeight) && {
						'border-right-width': `${dividerLineWeight}${dividerLineWeightUnit}`,
						width: `${dividerLineWeight}${dividerLineWeightUnit}`,
					}),
					...(!isNil(dividerSize) && { height: `${dividerSize}%` }),
				}),
			};
		} else {
			response[breakpoint] = {
				'flex-direction': 'row',
				'align-items': obj[`line-vertical-${breakpoint}`]
					? obj[`line-vertical-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: 'line-vertical',
							breakpoint,
							attributes: obj,
					  }),
				'justify-content': obj[`line-horizontal-${breakpoint}`]
					? obj[`line-horizontal-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: 'line-horizontal',
							breakpoint,
							attributes: obj,
					  }),
			};
		}
	});

	return response;
};

export default getDividerStyles;
