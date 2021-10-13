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
import { isNil, isEmpty } from 'lodash';

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

export const getArrowColorObject = (
	backgroundLayers,
	blockStyle,
	isHover = false
) => {
	const response = {
		label: 'Arrow Color',
		general: {},
	};

	const colorLayers = backgroundLayers.filter(
		layer => layer.type === 'color'
	);
	const layer = colorLayers ? colorLayers[colorLayers.length - 1] : null;

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const backgroundPaletteStatus = getLastBreakpointAttribute(
			'background-palette-color-status',
			breakpoint,
			layer,
			isHover
		);

		if (backgroundPaletteStatus) {
			const paletteColor = getLastBreakpointAttribute(
				'background-palette-color',
				breakpoint,
				layer,
				isHover
			);
			const paletteOpacity = getLastBreakpointAttribute(
				'background-palette-opacity',
				breakpoint,
				layer,
				isHover
			);

			response[breakpoint]['background-color'] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		} else {
			const backgroundColor = getLastBreakpointAttribute(
				'background-color',
				breakpoint,
				layer,
				isHover
			);
			response[breakpoint]['background-color'] = backgroundColor;
		}
	});

	return response;
};

const getArrowStyles = props => {
	const {
		target = '',
		blockStyle,
		isHover = false,
		'background-layers': backgroundLayers,
	} = props;

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

	const isBackgroundColor = !isEmpty(backgroundLayers)
		? backgroundLayers.some(layer => layer.type === 'color')
		: false;

	if (
		!props['arrow-status'] ||
		!isBackgroundColor ||
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
					...getArrowColorObject(backgroundLayers, blockStyle),
				},
			},
		[`${target} .maxi-container-arrow:before`]: {
			background: {
				...getArrowColorObject(backgroundLayers, blockStyle),
			},
		},
		...(props['background-hover-status'] && {
			[`${target}:hover .maxi-container-arrow:before`]: {
				background: {
					...getArrowColorObject(
						getGroupAttributes(props, 'background', true),
						blockStyle,
						true
					),
				},
			},
		}),
		...(props['background-hover-status'] && {
			[`${target}:hover .maxi-container-arrow .maxi-container-arrow--content:after`]:
				{
					background: {
						...getArrowColorObject(
							getGroupAttributes(props, 'background', isHover),
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
