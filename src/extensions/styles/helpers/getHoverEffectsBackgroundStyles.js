/**
 * Internal dependencies
 */
import { getGroupAttributes, getLastBreakpointAttribute } from '..';
import {
	getColorBackgroundObject,
	getGradientBackgroundObject,
} from './getBackgroundStyles';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getHoverEffectsBackgroundStyles = (props, parentBlockStyle) => {
	const response = {
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		const currentActiveMedia = getLastBreakpointAttribute(
			'hover-background-active-media',
			breakpoint,
			props
		);

		if (!currentActiveMedia) return;

		merge(response, {
			...(currentActiveMedia === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundColor',
						false,
						'hover-'
					),
					blockStyle: parentBlockStyle,
					breakpoint,
					prefix: 'hover-',
				}),
			}),
			...(currentActiveMedia === 'gradient' && {
				background: getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundGradient',
						false,
						'hover-'
					),
					breakpoint,
					prefix: 'hover-',
				}),
			}),
		});

		if (currentActiveMedia === 'gradient')
			response.background[breakpoint] = response.background[breakpoint]
				?.replace(/rgb\(/g, 'rgba(')
				.replace(
					/\((\d+),(\d+),(\d+)\)/g,
					`($1,$2,$3,${
						props['hover-background-gradient-opacity'] || 1
					})`
				);
	});

	return response;
};

export default getHoverEffectsBackgroundStyles;
