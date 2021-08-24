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
import { isNil, isUndefined } from 'lodash';

export const getArrowBorderObject = (
	props,
	parentBlockStyle,
	isHover = false,
	isOverlap = false
) => {
	const response = {};
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {};

		const paletteStatus = getLastBreakpointAttribute(
			'border-palette-color-status',
			breakpoint,
			props,
			isHover
		);
		const paletteColor =
			props[
				`border-palette-color-${breakpoint}${isHover ? '-hover' : ''}`
			];

		const paletteOpacity = getLastBreakpointAttribute(
			'border-palette-opacity',
			breakpoint,
			props,
			isHover
		);

		const borderStyle = getLastBreakpointAttribute(
			'border-style',
			breakpoint,
			props,
			isHover
		);
		const isBorderNone = isUndefined(borderStyle) || borderStyle === 'none';

		if (!isOverlap) {
			if (!isBorderNone)
				if (paletteStatus && paletteColor)
					response[breakpoint].background = getColorRGBAString({
						firstVar: `color-${paletteColor}`,
						opacity: paletteOpacity,
						blockStyle: parentBlockStyle,
					});
				else if (!paletteStatus)
					response[breakpoint].background =
						props[
							`border-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						];

			if (
				props[
					`border-bottom-width-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			) {
				response[breakpoint].top = `calc(${
					props[
						`border-bottom-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					] / 2
				}${
					props[
						`border-unit-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					]
				})`;

				response[breakpoint].left = `calc(${
					props[
						`border-bottom-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					] / 2
				}${
					props[
						`border-unit-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					]
				})`;

				response[breakpoint].width = `calc(50% + ${
					props[
						`border-bottom-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					] * 2
				}${
					props[
						`border-unit-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					]
				})`;

				response[breakpoint].height = `calc(50% + ${
					props[
						`border-bottom-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					] * 2
				}${
					props[
						`border-unit-width-${breakpoint}${
							isHover ? '-hover' : ''
						}`
					]
				})`;
			}
		}

		if (isOverlap) {
			let topPosition = 0;
			let leftPosition = 0;

			['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(
				item => {
					const borderRadius = getLastBreakpointAttribute(
						`border-${item}-radius`,
						breakpoint,
						props,
						isHover
					);
					const borderRadiusUnit = getLastBreakpointAttribute(
						'border-unit-radius',
						breakpoint,
						props,
						isHover
					);

					if (borderRadius)
						response[breakpoint][
							`border-${item}-radius`
						] = `${borderRadius}${borderRadiusUnit}`;
				}
			);

			['top', 'right', 'bottom', 'left'].forEach(item => {
				const borderWidth = getLastBreakpointAttribute(
					`border-${item}-width`,
					breakpoint,
					props,
					isHover
				);
				const borderUnitWidth = getLastBreakpointAttribute(
					'border-unit-width',
					breakpoint,
					props,
					isHover
				);
				const borderColor = getLastBreakpointAttribute(
					'border-color',
					breakpoint,
					props,
					isHover
				);

				if (borderWidth) {
					if (paletteStatus && paletteColor)
						response[breakpoint][`border-${item}-color`] =
							getColorRGBAString({
								firstVar: `color-${paletteColor}`,
								opacity: paletteOpacity,
								blockStyle: parentBlockStyle,
							});
					else
						response[breakpoint][`border-${item}-color`] =
							borderColor;

					response[breakpoint][`border-${item}-style`] = 'solid';
					response[breakpoint][
						`border-${item}-width`
					] = `${borderWidth}${borderUnitWidth}`;

					if (item === 'top' && borderWidth)
						topPosition = `-${borderWidth}${borderUnitWidth}`;

					if (item === 'left' && borderWidth)
						leftPosition = `-${borderWidth}${borderUnitWidth}`;
				}
			});

			response[breakpoint].top = topPosition;
			response[breakpoint].left = leftPosition;
		}
	});

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
		props[`background-active-media${isHover ? '-hover' : ''}`] ===
		'gradient'
	) {
		response.general.background =
			props[`background-gradient${isHover ? '-hover' : ''}`];
	}

	if (!props['background-layers-status'])
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
