/**
 * Internal dependencies
 */
import getBoxShadowStyles from './getBoxShadowStyles';
import getColorRGBAString from '../getColorRGBAString';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import getPaletteAttributes from '../getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getArrowObject = props => {
	const response = {};
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const arrowStatus = getLastBreakpointAttribute({
			target: 'arrow-status',
			breakpoint,
			attributes: props,
		});
		const arrowWidth = getLastBreakpointAttribute({
			target: 'arrow-width',
			breakpoint,
			attributes: props,
		});
		const arrowSide = getLastBreakpointAttribute({
			target: 'arrow-side',
			breakpoint,
			attributes: props,
		});
		const arrowPosition = getLastBreakpointAttribute({
			target: 'arrow-position',
			breakpoint,
			attributes: props,
		});

		response[breakpoint].display = arrowStatus ? 'block' : 'none';

		if (!isNil(arrowWidth)) {
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

		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj: layer,
				prefix: 'background-',
				isHover,
				breakpoint,
			});

		if (paletteStatus)
			response[breakpoint]['background-color'] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		else response[breakpoint]['background-color'] = color;
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
		!Object.entries(getGroupAttributes(props, 'arrow')).some(
			([key, val]) => {
				if (key.includes('arrow-status') && val) return true;
				return false;
			}
		) ||
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
		...(props['block-background-hover-status'] && {
			[`${target}:hover .maxi-container-arrow:before`]: {
				background: {
					...getArrowColorObject(backgroundLayers, blockStyle, true),
				},
			},
		}),
		...(props['block-background-hover-status'] && {
			[`${target}:hover .maxi-container-arrow .maxi-container-arrow--content:after`]:
				{
					background: {
						...getArrowColorObject(
							backgroundLayers,
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
