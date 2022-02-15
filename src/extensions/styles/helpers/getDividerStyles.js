/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';

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
		if (!paletteStatus && !isNil(color)) return { 'border-color': color };
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

			response[breakpoint] = {
				'border-top-style': dividerBorderStyle,
				...getColor(breakpoint),
				...(obj[`divider-border-radius-${breakpoint}`] &&
					obj[`divider-border-style-${breakpoint}`] === 'solid' && {
						'border-radius': '20px',
					}),

				...(isHorizontal && {
					'border-right-style': 'none',
					width: !isNil(obj[`divider-width-${breakpoint}`])
						? `${obj[`divider-width-${breakpoint}`]}${
								obj[`divider-width-unit-${breakpoint}`]
						  }`
						: '50%',
					...(!isNil(obj[`divider-border-top-width-${breakpoint}`])
						? {
								'border-top-width': `${
									obj[
										`divider-border-top-width-${breakpoint}`
									]
								}${
									obj[`divider-border-top-unit-${breakpoint}`]
								}`,
						  }
						: { 'border-top-width': '2px' }),
				}),

				...(!isHorizontal && {
					'border-top-style': 'none',
					'border-right-style': dividerBorderStyle ?? 'solid',
					...(!isNil(obj[`divider-border-right-width-${breakpoint}`])
						? {
								'border-right-width': `${
									obj[
										`divider-border-right-width-${breakpoint}`
									]
								}${
									obj[
										`divider-border-right-unit-${breakpoint}`
									]
								}`,
						  }
						: {
								'border-right-width': '2px',
						  }),
					...(!isNil(obj[`divider-height-${breakpoint}`])
						? {
								height: `${
									obj[`divider-height-${breakpoint}`]
								}%}`,
						  }
						: { height: '100%' }),
				}),
			};
		} else {
			response[breakpoint] = {
				'flex-direction': obj[`line-align-${breakpoint}`] ?? 'row',
				'align-items': 'center',
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
