/**
 * Internal dependencies
 */
import getBoxShadowStyles from './getBoxShadowStyles';
import getColorRGBAString from '../getColorRGBAString';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getArrowObject = props => {
	const response = {};
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	if (!props['arrow-status']) return response;

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const arrowWidth = getLastBreakpointAttribute(
			'arrow-width',
			breakpoint,
			props
		);
		const arrowSide = getLastBreakpointAttribute(
			'arrow-side',
			breakpoint,
			props
		);
		const arrowPosition = getLastBreakpointAttribute(
			'arrow-position',
			breakpoint,
			props
		);

		if (!isNil(arrowWidth)) {
			response[breakpoint].display = 'block';
			response[breakpoint].width = `${arrowWidth}px`;
			response[breakpoint].height = `${arrowWidth}px`;
		}

		if (arrowSide === 'top') {
			response[breakpoint].left = `${arrowPosition}%`;
			response[breakpoint].top = `-${(Math.sqrt(2) * arrowWidth) / 2}px`;
		}

		if (arrowSide === 'right') {
			response[breakpoint].top = `${arrowPosition}%`;
			response[breakpoint].left = `calc(100% + ${Math.floor(
				(Math.sqrt(2) * arrowWidth) / 2
			)}px)`;
		}

		if (arrowSide === 'bottom') {
			response[breakpoint].left = `${arrowPosition}%`;
			response[breakpoint].top = `calc(100% + ${Math.floor(
				(Math.sqrt(2) * arrowWidth) / 2 + 1
			)}px)`;
		}

		if (arrowSide === 'left') {
			response[breakpoint].top = `${arrowPosition}%`;
			response[breakpoint].left = `-${Math.floor(
				(Math.sqrt(2) * arrowWidth) / 2
			)}px`;
		}
	});

	return response;
};

export const getArrowColorObject = (props, blockStyle, isHover = false) => {
	const response = {
		label: 'Arrow Color',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		const activeMedia = getLastBreakpointAttribute(
			'background-active-media',
			breakpoint,
			props,
			isHover
		);
		if (activeMedia === 'gradient') {
			const gradient = getLastBreakpointAttribute(
				'background-gradient',
				breakpoint,
				props,
				isHover
			);
			response[breakpoint].background = gradient;
		}

		const backgroundLayersStatus = getLastBreakpointAttribute(
			'background-layers-status',
			breakpoint,
			props,
			isHover
		);

		if (!backgroundLayersStatus) {
			const backgroundPaletteStatus = getLastBreakpointAttribute(
				'background-palette-color-status',
				breakpoint,
				props,
				isHover
			);
			if (backgroundPaletteStatus) {
				const paletteColor = getLastBreakpointAttribute(
					'background-palette-color',
					breakpoint,
					props,
					isHover
				);
				const paletteOpacity = getLastBreakpointAttribute(
					'background-palette-opacity',
					breakpoint,
					props,
					isHover
				);

				response.general['background-color'] = getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				});
			} else {
				const backgroundColor = getLastBreakpointAttribute(
					'background-color',
					breakpoint,
					props,
					isHover
				);
				response.general['background-color'] = backgroundColor;
			}
		}
	});

	return response;
};

const getArrowStyles = props => {
	const { target = '', blockStyle, isHover = false } = props;

	// Checks if border is active on some responsive stage
	const isBorderActive = Object.entries(props).some(([key, val]) => {
		if (key.includes('border-style') && !isNil(val) && val !== 'none')
			return true;

		return false;
	});
	// Checks if all border styles are 'solid' or 'none'
	const isCorrectBorder = Object.entries(props).every(([key, val]) => {
		if (key.includes('border-style')) {
			if (
				key === 'border-style-general' &&
				val !== 'solid' &&
				val !== 'none'
			)
				return false;

			if (!isNil(val) && val !== 'solid' && val !== 'none') return false;
		}

		return true;
	});

	const isBGColorActiveMedia = Object.entries(props).every(([key, val]) => {
		if (key.includes('background-active-media') && val)
			return val === 'color';

		return true;
	});

	if (
		!props['arrow-status'] ||
		!isBGColorActiveMedia ||
		(isBorderActive && !isCorrectBorder)
	)
		return {};

	const response = {
		...(!isHover && {
			[`${target} .maxi-container-arrow .maxi-container-arrow--content`]:
				{
					arrow: {
						...getArrowObject(getGroupAttributes(props, 'arrow')),
					},
				},
		}),
		[`${target} .maxi-container-arrow`]: {
			shadow: {
				...getBoxShadowStyles({
					obj: getGroupAttributes(props, 'boxShadow'),
					dropShadow: true,
					parentBlockStyle: blockStyle,
				}),
			},
		},
		...(props['box-shadow-status-hover'] && {
			[`${target}${isHover ? ':hover' : ''} .maxi-container-arrow`]: {
				shadow: {
					...getBoxShadowStyles({
						obj: getGroupAttributes(props, 'boxShadow', isHover),
						isHover,
						dropShadow: true,
						parentBlockStyle: blockStyle,
					}),
				},
			},
		}),
		[`${target} .maxi-container-arrow .maxi-container-arrow--content:after`]:
			{
				background: {
					...getArrowColorObject(
						getGroupAttributes(props, [
							'background',
							'backgroundColor',
							'backgroundGradient',
						]),
						blockStyle
					),
				},
			},
		[`${target} .maxi-container-arrow:before`]: {
			background: {
				...getArrowColorObject(
					getGroupAttributes(props, [
						'background',
						'backgroundColor',
						'backgroundGradient',
					]),
					blockStyle
				),
			},
		},
		...(props['background-status-hover'] && {
			[`${target}:hover .maxi-container-arrow:before`]: {
				background: {
					...getArrowColorObject(
						getGroupAttributes(
							props,
							[
								'background',
								'backgroundColor',
								'backgroundGradient',
							],
							true
						),
						blockStyle,
						true
					),
				},
			},
		}),
		...(props['background-status-hover'] && {
			[`${target}:hover .maxi-container-arrow .maxi-container-arrow--content:after`]:
				{
					background: {
						...getArrowColorObject(
							getGroupAttributes(
								props,
								[
									'background',
									'backgroundColor',
									'backgroundGradient',
								],
								isHover
							),
							blockStyle,
							isHover
						),
					},
				},
		}),
	};

	return response;
};

export default getArrowStyles;
