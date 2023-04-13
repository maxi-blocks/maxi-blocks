/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';
import getPaletteAttributes from '../../attributes/getPaletteAttributes';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getDividerStyles = (
	obj,
	target,
	blockStyle,
	isHover = false,
	prefix = '',
	useBottomBorder = false
) => {
	const response = {
		label: 'Divider',
		general: {},
	};

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: `${prefix}divider-border-`,
				breakpoint,
				isHover,
			});

		if (paletteStatus && isNumber(paletteColor))
			return {
				'border-color': getColorRGBAString({
					firstVar: `${prefix}divider-color`,
					secondVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				}),
			};

		return { 'border-color': color };
	};

	const getPrevBreakpoint = breakpoint =>
		breakpoints[breakpoints.indexOf(breakpoint) - 1] ?? 'general';

	breakpoints.forEach(breakpoint => {
		if (target === 'line') {
			const isHorizontal =
				getLastBreakpointAttribute({
					target: 'line-orientation',
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) === 'horizontal';

			const dividerBorderStyle = getLastBreakpointAttribute({
				target: 'divider-border-style',
				prefix,
				breakpoint,
				attributes: obj,
				isHover,
			});

			const positionHorizontal = useBottomBorder ? 'bottom' : 'top';
			const positionVertical = 'right';

			const dividerLineWeight = isHorizontal
				? getLastBreakpointAttribute({
						target: 'divider-border-top',
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  })
				: getLastBreakpointAttribute({
						target: `divider-border-${positionVertical}`,
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  });
			const dividerLineWeightUnit =
				getLastBreakpointAttribute({
					target: isHorizontal
						? 'divider-border-top.u'
						: `divider-border-${positionVertical}.u`,
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';

			const dividerSize = isHorizontal
				? getLastBreakpointAttribute({
						target: 'divider-width',
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  })
				: getLastBreakpointAttribute({
						target: 'divider-height',
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  });
			const dividerSizeUnit =
				getLastBreakpointAttribute({
					target: 'divider-width.u',
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';

			const dividerBorderRadius = getLastBreakpointAttribute({
				target: 'divider-border-radius',
				prefix,
				breakpoint,
				attributes: obj,
				isHover,
			});

			response[breakpoint] = {
				...getColor(breakpoint),
				...(dividerBorderStyle === 'solid' &&
					(dividerBorderRadius
						? {
								'border-radius': '20px',
						  }
						: getLastBreakpointAttribute({
								target: 'divider-border-radius',
								prefix,
								breakpoint: getPrevBreakpoint(breakpoint),
								attributes: obj,
								isHover,
						  }) && {
								'border-radius': '0px',
						  })),

				...(isHorizontal && {
					[`border-${positionHorizontal}-style`]: dividerBorderStyle,
					[`border-${positionVertical}-style`]: 'none',
					...(!isNil(dividerLineWeight) && {
						[`border-${positionHorizontal}-width`]: `${dividerLineWeight}${dividerLineWeightUnit}`,
						height: `${dividerLineWeight}${dividerLineWeightUnit}`,
					}),
					...(!isNil(dividerSize) && {
						width: `${dividerSize}${dividerSizeUnit}`,
					}),
				}),

				...(!isHorizontal && {
					[`border-${positionHorizontal}-style`]: 'none',
					[`border-${positionVertical}-style`]: dividerBorderStyle,
					...(!isNil(dividerLineWeight) && {
						[`border-${positionVertical}-width`]: `${dividerLineWeight}${dividerLineWeightUnit}`,
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
							prefix,
							breakpoint,
							attributes: obj,
							isHover,
					  }),
				'justify-content': obj[`line-horizontal-${breakpoint}`]
					? obj[`line-horizontal-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: 'line-horizontal',
							prefix,
							breakpoint,
							attributes: obj,
							isHover,
					  }),
			};
		}
	});

	return response;
};

export default getDividerStyles;
