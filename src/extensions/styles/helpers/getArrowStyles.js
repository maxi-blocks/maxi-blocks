/**
 * Internal dependencies
 */
import getBoxShadowStyles from './getBoxShadowStyles';
import getGroupAttributes from '../getGroupAttributes';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import { getPaletteDefault } from '..';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

export const getArrowBorderObject = props => {
	const response = {
		label: 'Arrow Border',
		general: {},
	};

	if (!props['palette-custom-border-color']) {
		const paletteColor =
			props['palette-preset-border-color'] || getPaletteDefault('border');

		response.general.background = `var(--maxi-light-color-${paletteColor})`;
	} else if (!isEmpty(props['border-color-general']))
		response.general.background = props['border-color-general'];

	if (props['border-bottom-width-general']) {
		response.general.top = `calc(${
			props['border-bottom-width-general'] / 2
		}${props['border-unit-width-general']})`;

		response.general.left = `calc(${
			props['border-bottom-width-general'] / 2
		}${props['border-unit-width-general']})`;

		response.general.width = `calc(50% + ${
			props['border-bottom-width-general'] * 2
		}${props['border-unit-width-general']})`;

		response.general.height = `calc(50% + ${
			props['border-bottom-width-general'] * 2
		}${props['border-unit-width-general']})`;
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

export const getArrowColorObject = props => {
	const response = {
		label: 'Arrow Color',
		general: {},
	};

	if (props['background-active-media'] === 'color') {
		if (!props['palette-custom-background-color']) {
			const paletteColor =
				props['palette-preset-background-color'] ||
				getPaletteDefault('background');

			response.general[
				'background-color'
			] = `var(--maxi-light-color-${paletteColor})`;
		} else response.general['background-color'] = props['background-color'];
	} else response.general.background = props['background-gradient'];

	return response;
};

const getArrowStyles = props => {
	const { target = '' } = props;

	return {
		[`${target} .maxi-container-arrow`]: {
			shadow: {
				...getBoxShadowStyles(
					getGroupAttributes(props, 'boxShadow'),
					false,
					true
				),
			},
		},
		[`${target} .maxi-container-arrow .maxi-container-arrow--content`]: {
			arrow: { ...getArrowObject(getGroupAttributes(props, 'arrow')) },
		},
		[`${target} .maxi-container-arrow .maxi-container-arrow--content:after`]:
			{
				background: {
					...getArrowColorObject(
						getGroupAttributes(props, [
							'background',
							'backgroundColor',
							'backgroundGradient',
							'palette',
						])
					),
				},
			},
		[`${target} .maxi-container-arrow .maxi-container-arrow--content:before`]:
			{
				border: {
					...getArrowBorderObject(
						getGroupAttributes(props, [
							'border',
							'borderWidth',
							'borderRadius',
							'palette',
						])
					),
				},
			},
	};
};

export default getArrowStyles;
