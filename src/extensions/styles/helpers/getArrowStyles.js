/**
 * Internal dependencies
 */
import getBoxShadowStyles from './getBoxShadowStyles';
import getGroupAttributes from '../getGroupAttributes';
import { getPaletteDefault } from '..';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
		response[breakpoint].display = 'block';

		const width = `${props[`arrow-width-${breakpoint}`]}${
			props[`arrow-width-unit-${breakpoint}`]
		}`;

		response[breakpoint].display = 'block';
		response[breakpoint].width = `${width}`;
		response[breakpoint].height = `${width}`;

		if (props[`arrow-side-${breakpoint}`] === 'top') {
			response[breakpoint].left = `${
				props[`arrow-position-${breakpoint}`]
			}%`;
			response[breakpoint].top = `-${
				(Math.sqrt(2) * props[`arrow-width-${breakpoint}`]) / 2
			}${props[`arrow-width-unit-${breakpoint}`]}`;
		}
		if (props[`arrow-side-${breakpoint}`] === 'right') {
			response[breakpoint].top = `${
				props[`arrow-position-${breakpoint}`]
			}%`;
			response[breakpoint].left = `calc(100% + ${Math.floor(
				(Math.sqrt(2) * props[`arrow-width-${breakpoint}`]) / 2
			)}${props[`arrow-width-unit-${breakpoint}`]})`;
		}
		if (props[`arrow-side-${breakpoint}`] === 'bottom') {
			response[breakpoint].left = `${
				props[`arrow-position-${breakpoint}`]
			}%`;
			response[breakpoint].top = `calc(100% + ${Math.floor(
				(Math.sqrt(2) * props[`arrow-width-${breakpoint}`]) / 2
			)}${props[`arrow-width-unit-${breakpoint}`]})`;
		}
		if (props[`arrow-side-${breakpoint}`] === 'left') {
			response[breakpoint].top = `${
				props[`arrow-position-${breakpoint}`]
			}%`;
			response[breakpoint].left = `-${Math.floor(
				(Math.sqrt(2) * props[`arrow-width-${breakpoint}`]) / 2
			)}${props[`arrow-width-unit-${breakpoint}`]}`;
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
			arrow: { ...getArrowObject(getGroupAttributes(props, 'arrow')) },
			shadow: {
				...getBoxShadowStyles(
					getGroupAttributes(props, 'boxShadow'),
					false,
					props['arrow-status']
				),
			},
		},
		[`${target} .maxi-container-arrow:after`]: {
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
		[`${target} .maxi-container-arrow:before`]: {
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
