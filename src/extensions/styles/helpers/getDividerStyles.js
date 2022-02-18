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
				getLastBreakpointAttribute(
					'line-orientation',
					breakpoint,
					obj
				) === 'horizontal';

			const dividerBorderStyle = getLastBreakpointAttribute(
				'divider-border-style',
				breakpoint,
				obj
			);

			const dividerLineWeight = isHorizontal
				? obj[`divider-border-top-width-${breakpoint}`]
				: obj[`divider-border-right-width-${breakpoint}`];
			const dividerLineWeightUnit =
				getLastBreakpointAttribute(
					isHorizontal
						? 'divider-border-top-unit'
						: 'divider-border-right-unit',
					breakpoint,
					obj
				) ?? 'px';

			const dividerSize = isHorizontal
				? obj[`divider-width-${breakpoint}`]
				: obj[`divider-height-${breakpoint}`];
			const dividerSizeUnit =
				getLastBreakpointAttribute(
					'divider-width-unit',
					breakpoint,
					obj
				) ?? 'px';

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
					...(!isNil(dividerSize) && { height: `${dividerSize}%}` }),
				}),
			};
		} else {
			response[breakpoint] = {
				'flex-direction': 'row',
				'align-items': obj[`line-vertical-${breakpoint}`]
					? obj[`line-vertical-${breakpoint}`]
					: getLastBreakpointAttribute(
							'line-vertical',
							breakpoint,
							obj
					  ),
				'justify-content': obj[`line-horizontal-${breakpoint}`]
					? obj[`line-horizontal-${breakpoint}`]
					: getLastBreakpointAttribute(
							'line-horizontal',
							breakpoint,
							obj
					  ),
			};
		}
	});

	return response;
};

export default getDividerStyles;
