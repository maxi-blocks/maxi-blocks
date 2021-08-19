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

export const getArrowBorderObject = (
	props,
	parentBlockStyle,
	isHover = false,
	isOverlap = false
) => {
	const response = {
		label: 'Arrow Border',
		general: {},
	};

	const paletteStatus = getLastBreakpointAttribute(
		'border-palette-color-status',
		'general',
		props,
		isHover
	);
	const paletteColor =
		isHover && props['border-status-hover']
			? props[`border-palette-color-general${isHover ? '-hover' : ''}`]
			: props['border-palette-color-general'];
	const paletteOpacity =
		isHover && props['border-status-hover']
			? props[`border-palette-opacity-general${isHover ? '-hover' : ''}`]
			: props['border-palette-opacity-general'];

	if (!isOverlap) {
		if (paletteStatus && paletteColor)
			response.general.background = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle: parentBlockStyle,
			});
		else
			response.general['border-color'] =
				props[`border-color-general${isHover ? '-hover' : ''}`];

		if (props[`border-bottom-width-general${isHover ? '-hover' : ''}`]) {
			response.general.top = `calc(${
				props[`border-bottom-width-general${isHover ? '-hover' : ''}`] /
				2
			}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;

			response.general.left = `calc(${
				props[`border-bottom-width-general${isHover ? '-hover' : ''}`] /
				2
			}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;

			response.general.width = `calc(50% + ${
				props[`border-bottom-width-general${isHover ? '-hover' : ''}`] *
				2
			}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;

			response.general.height = `calc(50% + ${
				props[`border-bottom-width-general${isHover ? '-hover' : ''}`] *
				2
			}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;
		}
	}

	if (isOverlap) {
		let topPosition = 0;
		let leftPosition = 0;

		if (props[`border-top-left-radius-general${isHover ? '-hover' : ''}`])
			response.general['border-top-left-radius'] = `
		${props[`border-top-left-radius-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-radius-general${isHover ? '-hover' : ''}`]
			}`;

		if (props[`border-top-right-radius-general${isHover ? '-hover' : ''}`])
			response.general['border-top-right-radius'] = `
		${props[`border-top-right-radius-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-radius-general${isHover ? '-hover' : ''}`]
			}`;

		if (
			props[`border-bottom-left-radius-general${isHover ? '-hover' : ''}`]
		)
			response.general['border-bottom-left-radius'] = `
		${props[`border-bottom-left-radius-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-radius-general${isHover ? '-hover' : ''}`]
			}`;

		if (
			props[
				`border-bottom-right-radius-general${isHover ? '-hover' : ''}`
			]
		)
			response.general['border-bottom-right-radius'] = `
		${props[`border-bottom-right-radius-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-radius-general${isHover ? '-hover' : ''}`]
			}`;

		if (paletteStatus && paletteColor)
			response.general['border-color'] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle: parentBlockStyle,
			});
		else
			response.general['border-color'] =
				props[`border-color-general${isHover ? '-hover' : ''}`];

		if (props[`border-top-width-general${isHover ? '-hover' : ''}`]) {
			response.general['border-top-style'] = 'solid';
			response.general['border-top-width'] = `
				${props[`border-top-width-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-width-general${isHover ? '-hover' : ''}`]
			}`;

			topPosition = `-${
				props[`border-top-width-general${isHover ? '-hover' : ''}`]
			}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]}`;
		}
		if (props[`border-right-width-general${isHover ? '-hover' : ''}`]) {
			response.general['border-right-style'] = 'solid';
			response.general['border-right-width'] = `
				${props[`border-right-width-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-width-general${isHover ? '-hover' : ''}`]
			}`;
		}
		if (props[`border-bottom-width-general${isHover ? '-hover' : ''}`]) {
			response.general['border-bottom-style'] = 'solid';
			response.general['border-bottom-width'] = `
				${props[`border-bottom-width-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-width-general${isHover ? '-hover' : ''}`]
			}`;
		}
		if (props[`border-left-width-general${isHover ? '-hover' : ''}`]) {
			response.general['border-left-style'] = 'solid';
			response.general['border-left-width'] = `
				${props[`border-left-width-general${isHover ? '-hover' : ''}`]}${
				props[`border-unit-width-general${isHover ? '-hover' : ''}`]
			}`;

			leftPosition = `-${
				props[`border-left-width-general${isHover ? '-hover' : ''}`]
			}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]}`;
		}

		response.general.top = topPosition || 0;
		response.general.left = leftPosition || 0;
	}

	return response;
};

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

	if (
		props[`background-active-media${isHover ? '-hover' : ''}`] === 'layers'
	) {
		if (
			props['background-layers-status'] &&
			props['background-layers']?.length > 0 &&
			props['background-layers'][0].type === 'color'
		) {
			if (
				props['background-layers'][0][
					`background-palette-color-status${isHover ? '-hover' : ''}`
				]
			) {
				const paletteColor =
					props['background-layers'][0][
						`background-palette-color${isHover ? '-hover' : ''}`
					];
				const paletteOpacity =
					props['background-layers'][0][
						`background-palette-opacity${isHover ? '-hover' : ''}`
					];

				response.general['background-color'] = getColorRGBAString({
					firstVar: `color-${paletteColor}`,
					opacity: paletteOpacity,
					blockStyle,
				});
			} else
				response.general['background-color'] =
					props['background-layers'][0][
						`background-color${isHover ? '-hover' : ''}`
					];
		}
	} else {
		if (
			props[`background-active-media${isHover ? '-hover' : ''}`] ===
			'gradient'
		) {
			response.general.background =
				props[`background-gradient${isHover ? '-hover' : ''}`];
		}

		if (
			props[`background-palette-color-status${isHover ? '-hover' : ''}`]
		) {
			const paletteColor =
				props[`background-palette-color${isHover ? '-hover' : ''}`];
			const paletteOpacity =
				props[`background-palette-opacity${isHover ? '-hover' : ''}`];

			response.general['background-color'] = getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			});
		} else
			response.general['background-color'] =
				props[`background-color${isHover ? '-hover' : ''}`];
	}

	return response;
};

const getArrowStyles = props => {
	const { target = '', blockStyle, isHover = false } = props;

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
			border: {
				...getArrowBorderObject(
					getGroupAttributes(props, [
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle,
					false,
					true
				),
			},
		},
		...(props['background-status-hover'] && {
			[`${target}:hover .maxi-container-arrow:before`]: {
				background: {
					...getArrowColorObject(
						getGroupAttributes(props, [
							'background',
							'backgroundColor',
							'backgroundGradient',
						]),
						blockStyle,
						isHover
					),
				},
			},
		}),
		...(props['border-status-hover'] && {
			[`${target}:hover .maxi-container-arrow:before`]: {
				border: {
					...getArrowBorderObject(
						getGroupAttributes(props, [
							'border',
							'borderWidth',
							'borderRadius',
						]),
						blockStyle,
						isHover,
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
		[`${target} .maxi-container-arrow .maxi-container-arrow--content:before`]:
			{
				border: {
					...getArrowBorderObject(
						getGroupAttributes(props, [
							'border',
							'borderWidth',
							'borderRadius',
						]),
						blockStyle
					),
				},
			},
		...(props['border-status-hover'] && {
			[`${target}:hover .maxi-container-arrow .maxi-container-arrow--content:before`]:
				{
					border: {
						...getArrowBorderObject(
							getGroupAttributes(
								props,
								['border', 'borderWidth', 'borderRadius'],
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
