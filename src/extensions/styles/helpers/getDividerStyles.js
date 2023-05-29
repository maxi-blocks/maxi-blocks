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

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
		g: {},
	};

	const getColor = breakpoint => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj,
				prefix: `${prefix}di-bo-`,
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
		breakpoints[breakpoints.indexOf(breakpoint) - 1] ?? 'g';

	breakpoints.forEach(breakpoint => {
		if (target === 'line') {
			const isHorizontal =
				getLastBreakpointAttribute({
					target: '_lo',
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) === 'horizontal';

			const dividerBorderStyle = getLastBreakpointAttribute({
				target: 'di-bo_s',
				prefix,
				breakpoint,
				attributes: obj,
				isHover,
			});

			const positionHorizontal = useBottomBorder ? 'bottom' : 'top';
			const positionVertical = 'right';

			const dividerLineWeight = isHorizontal
				? getLastBreakpointAttribute({
						target: 'di-bo.t',
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  })
				: getLastBreakpointAttribute({
						target: `di-bo.${positionVertical[0]}`,
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  });
			const dividerLineWeightUnit =
				getLastBreakpointAttribute({
					target: isHorizontal
						? 'di-bo.t.u'
						: `di-bo.${positionVertical[0]}.u`,
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';

			const dividerSize = isHorizontal
				? getLastBreakpointAttribute({
						target: 'di_w',
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  })
				: getLastBreakpointAttribute({
						target: 'di_h',
						prefix,
						breakpoint,
						attributes: obj,
						isHover,
				  });
			const dividerSizeUnit =
				getLastBreakpointAttribute({
					target: 'di_w.u',
					prefix,
					breakpoint,
					attributes: obj,
					isHover,
				}) ?? 'px';

			const dividerBorderRadius = getLastBreakpointAttribute({
				target: 'di-bo.ra',
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
								target: 'di-bo.ra',
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
				'align-items': obj[`_lv-${breakpoint}`]
					? obj[`_lv-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: '_lv',
							prefix,
							breakpoint,
							attributes: obj,
							isHover,
					  }),
				'justify-content': obj[`_lh-${breakpoint}`]
					? obj[`_lh-${breakpoint}`]
					: getLastBreakpointAttribute({
							target: '_lh',
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
