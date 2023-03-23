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
import { isNil, isEmpty, isNumber } from 'lodash';
import getAttributesValue from '../getAttributesValue';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const getArrowObject = props => {
	const response = {};
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const {
			'arrow-status': arrowStatus,
			'arrow-width': arrowWidth,
			'arrow-side': arrowSide,
			'arrow-position': arrowPosition,
		} = getLastBreakpointAttribute({
			target: [
				'arrow-status',
				'arrow-width',
				'arrow-side',
				'arrow-position',
			],
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

export const getArrowBorder = (props, isHover) => {
	const response = {
		label: 'Arrow Border',
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};
		const borderRadiusUnit = getLastBreakpointAttribute({
			target: 'border-radius-unit',
			breakpoint,
			attributes: props,
			isHover,
		});

		['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(
			target => {
				const val = getLastBreakpointAttribute({
					target: `border-radius-${target}`,
					breakpoint,
					attributes: props,
					isHover,
				});

				if (isNumber(val))
					response[breakpoint][
						`border-${target}-radius`
					] = `${val}${borderRadiusUnit}`;
			}
		);
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
	const { target = '', blockStyle, isHover = false } = props;
	const {
		'background-layers': backgroundLayers,
		'box-shadow-status-hover': boxShadowStatusHover,
		'block-background-status-hover': blockBackgroundStatusHover,
	} = getAttributesValue({
		target: [
			'background-layers',
			'box-shadow-status-hover',
			'block-background-status-hover',
		],
		props,
	});

	// Checks if border is active on some responsive stage
	const isBorderActive = breakpoints.some(breakpoint => {
		const borderStyle = getLastBreakpointAttribute({
			target: 'border-style',
			breakpoint,
			attributes: props,
			isHover,
		});

		return !isNil(borderStyle) && borderStyle !== 'none';
	});

	// Checks if all border styles are 'solid' or 'none'
	const isCorrectBorder = breakpoints.every(breakpoint => {
		const borderStyle = getAttributesValue({
			target: 'border-style',
			breakpoint,
			props,
		});

		if (
			breakpoint === 'general' &&
			borderStyle !== 'solid' &&
			borderStyle !== 'none'
		)
			return false;

		return (
			isNil(borderStyle) ||
			borderStyle === 'solid' ||
			borderStyle === 'none'
		);
	});

	// Checks if background color is active on some responsive stage
	const isBackgroundColor = !isEmpty(backgroundLayers)
		? backgroundLayers.some(layer => layer.type === 'color')
		: false;

	// Checks if arrow is active on some responsive stage
	const arrowStatus = breakpoints.some(breakpoint => {
		const arrowStatus = getLastBreakpointAttribute({
			target: 'arrow-status',
			breakpoint,
			attributes: props,
			isHover,
		});

		return arrowStatus;
	});

	if (
		!arrowStatus ||
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
					blockStyle,
				}),
			},
		},
		...(boxShadowStatusHover && {
			[`${target}${isHover ? ':hover' : ''} .maxi-container-arrow`]: {
				shadow: {
					...getBoxShadowStyles({
						obj: getGroupAttributes(props, 'boxShadow', isHover),
						isHover,
						dropShadow: true,
						blockStyle,
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
			borderRadius: {
				...getArrowBorder(
					getGroupAttributes(props, 'borderRadius', isHover),
					false
				),
			},
		},
		...(blockBackgroundStatusHover && {
			[`${target}:hover .maxi-container-arrow:before`]: {
				background: {
					...getArrowColorObject(backgroundLayers, blockStyle, true),
				},
				borderRadius: {
					...getArrowBorder(
						getGroupAttributes(props, 'borderRadius', isHover),
						true
					),
				},
			},
		}),
		...(blockBackgroundStatusHover && {
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
