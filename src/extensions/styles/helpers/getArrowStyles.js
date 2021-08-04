/**
 * Internal dependencies
 */
import getBoxShadowStyles from './getBoxShadowStyles';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

export const getArrowBorderObject = (
	props,
	parentBlockStyle,
	isHover = false
) => {
	const response = {
		label: 'Arrow Border',
		general: {},
	};

	if (
		props[`border-palette-color-status-general${isHover ? '-hover' : ''}`]
	) {
		const paletteColor =
			props[`border-palette-color-general${isHover ? '-hover' : ''}`];

		response.general.background = `var(--maxi-${parentBlockStyle}-color-${paletteColor})`;
	} else if (
		!isEmpty(props[`border-color-general${isHover ? '-hover' : ''}`])
	)
		response.general.background =
			props[`border-color-general${isHover ? '-hover' : ''}`];

	if (props[`border-bottom-width-general${isHover ? '-hover' : ''}`]) {
		response.general.top = `calc(${
			props[`border-bottom-width-general${isHover ? '-hover' : ''}`] / 2
		}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;

		response.general.left = `calc(${
			props[`border-bottom-width-general${isHover ? '-hover' : ''}`] / 2
		}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;

		response.general.width = `calc(50% + ${
			props[`border-bottom-width-general${isHover ? '-hover' : ''}`] * 2
		}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;

		response.general.height = `calc(50% + ${
			props[`border-bottom-width-general${isHover ? '-hover' : ''}`] * 2
		}${props[`border-unit-width-general${isHover ? '-hover' : ''}`]})`;
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
		props[`background-active-media${isHover ? '-hover' : ''}`] ===
		'gradient'
	) {
		response.general.background =
			props[`background-gradient${isHover ? '-hover' : ''}`];
	} else if (
		props[`background-palette-color-status${isHover ? '-hover' : ''}`]
	) {
		const paletteColor =
			props[`background-palette-color${isHover ? '-hover' : ''}`];

		response.general[
			'background-color'
		] = `var(--maxi-${blockStyle}-color-${paletteColor})`;
	} else
		response.general['background-color'] =
			props[`background-color${isHover ? '-hover' : ''}`];

	return response;
};

const getArrowStyles = props => {
	const { target = '', blockStyle } = props;

	const response = {
		[`.${target} .maxi-container-arrow .maxi-container-arrow--content`]: {
			arrow: { ...getArrowObject(getGroupAttributes(props, 'arrow')) },
		},
		[`.${target} .maxi-container-arrow`]: {
			shadow: {
				...getBoxShadowStyles({
					obj: getGroupAttributes(props, 'boxShadow'),
					dropShadow: true,
					parentBlockStyle: blockStyle,
				}),
			},
		},
		[`.${target} .maxi-container-arrow .maxi-container-arrow--content:after`]:
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
		[`.${target} .maxi-container-arrow .maxi-container-arrow--content:before`]:
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

		[`.${target}:hover .maxi-container-arrow`]: {
			shadow: {
				...getBoxShadowStyles({
					obj: getGroupAttributes(props, 'boxShadow', true),
					dropShadow: true,
					parentBlockStyle: blockStyle,
					isHover: true,
				}),
			},
		},
		[`.${target}:hover .maxi-container-arrow .maxi-container-arrow--content:after`]:
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
							true
						),
						blockStyle,
						true
					),
				},
			},
		[`.${target}:hover .maxi-container-arrow .maxi-container-arrow--content:before`]:
			{
				border: {
					...getArrowBorderObject(
						getGroupAttributes(
							props,
							['border', 'borderWidth', 'borderRadius'],
							true
						),
						blockStyle,
						true
					),
				},
			},
	};

	return response;
};

export default getArrowStyles;
