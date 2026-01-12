/**
 * Internal dependencies
 */
import getBoxShadowStyles from './getBoxShadowStyles';
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import getPaletteAttributes from '@extensions/styles/getPaletteAttributes';

/**
 * External dependencies
 */
import { isNil, isEmpty, isNumber } from 'lodash';
import { __ } from '@wordpress/i18n';

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

export const getArrowBorder = (props, isHover) => {
	const response = {
		label: __('Arrow Border', 'maxi-blocks'),
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};
		const borderRadiusUnit = getLastBreakpointAttribute({
			target: 'border-unit-radius',
			breakpoint,
			attributes: props,
			isHover,
		});

		['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(
			target => {
				const val = getLastBreakpointAttribute({
					target: `border-${target}-radius`,
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
		label: __('Arrow Color', 'maxi-blocks'),
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
					blockStyle,
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
		...(props['block-background-status-hover'] && {
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
		...(props['block-background-status-hover'] && {
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
