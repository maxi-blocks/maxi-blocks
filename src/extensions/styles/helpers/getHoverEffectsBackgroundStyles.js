/**
 * Internal dependencies
 */
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import {
	getColorBackgroundObject,
	getGradientBackgroundObject,
} from './getBackgroundStyles';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getHoverEffectsBackgroundStyles = (props, blockStyle) => {
	const response = {
		general: {},
	};

	breakpoints.forEach(breakpoint => {
		const currentActiveMedia = getLastBreakpointAttribute({
			target: 'hover-background-active-media',
			breakpoint,
			attributes: props,
		});

		if (!currentActiveMedia) return;

		if (currentActiveMedia === 'none') {
			merge(response, {
				background: {
					[breakpoint]: {
						background: 'none',
					},
				},
			});
			return;
		}

		merge(response, {
			...(currentActiveMedia === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundColor',
						false,
						'hover-'
					),
					blockStyle,
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

		if (
			currentActiveMedia === 'gradient' &&
			response.background?.[breakpoint]?.background
		)
			response.background[breakpoint].background = response.background[
				breakpoint
			].background
				.replace(/rgb\(/g, 'rgba(')
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
