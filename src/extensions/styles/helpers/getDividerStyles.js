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

	console.log(obj);
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
		else if (!paletteStatus && !isNil(color))
			return { 'border-color': color };
	};

	breakpoints.forEach(breakpoint => {
		let border_style, width, border_color, border_right, border_top_width;

		if (target === 'line') {
			response[breakpoint] = {
				...(!isNil(obj[`divider-border-style-${breakpoint}`]) && {
					'border-style': obj[`divider-border-style-${breakpoint}`],
				}),
				...getColor(breakpoint),
				...(obj[`line-orientation-${breakpoint}`] === 'horizontal' && {
					'border-right': 'none',
					...(obj[`divider-border-radius-${breakpoint}`] &&
						obj[`divider-border-style-${breakpoint}`] ===
							'solid' && { 'border-radius': '20px' }),
					...(!isNil(obj[`divider-width-${breakpoint}`]) && {
						width: `${obj[`divider-width-${breakpoint}`]}${
							obj[`divider-width-unit-${breakpoint}`]
						}`,
					}),
					...(!isNil(
						obj[`divider-border-top-width-${breakpoint}`]
					) && {
						'border-top-width': `${
							obj[`divider-border-top-width-${breakpoint}`]
						}${obj[`divider-border-top-unit-${breakpoint}`]}`,
					}),
				}),
				...(obj[`line-orientation-${breakpoint}`] === 'vertical' && {
					'border-top': 'none',
					...(obj[`divider-border-radius-${breakpoint}`] &&
						obj[`divider-border-style-${breakpoint}`] ===
							'solid' && {
							'border-radius': '20px',
						}),
					...(!isNil(
						obj[`divider-border-right-width-${breakpoint}`]
					) && {
						['border-right-width']: `${
							obj[`divider-border-right-width-${breakpoint}`]
						}${obj[`divider-border-right-unit-${breakpoint}`]}`,
					}),
					...(!isNil(obj[`divider-height-${breakpoint}`]) && {
						height: `${obj[`divider-height-${breakpoint}`]}%}`,
					}),
				}),
			};
		} else {
			response[breakpoint] = {
				'flex-direction': obj[`line-align-${breakpoint}`] ?? 'center',
				// row
				...(obj[`line-align-${breakpoint}`] === 'row'
					? {
							...(!isNil(obj[`line-vertical-${breakpoint}`]) && {
								'align-items':
									obj[`line-vertical-${breakpoint}`] ??
									'center',
							},
							!isNil(obj[`line-horizontal-${breakpoint}`]) && {
								'justify-content':
									obj[`line-horizontal-${breakpoint}`] ??
									'center',
							}),
					  }
					: {
							...(!isNil(obj[`line-vertical-${breakpoint}`]) && {
								'justify-content':
									obj[`line-vertical-${breakpoint}`] ??
									'center',
							},
							!isNil(obj[`line-horizontal-${breakpoint}`]) && {
								'align-items':
									obj[`line-horizontal-${breakpoint}`] ??
									'center',
							}),
					  }),
			};
		}
	});

	console.log(response);
	return response;
};

export default getDividerStyles;
