/**
 * Internal dependencies
 */
import getGroupAttributes from '../../attributes/getGroupAttributes';
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';
import {
	getColorBackgroundObject,
	getGradientBackgroundObject,
} from './getBackgroundStyles';
import getAttributesValue from '../../attributes/getAttributesValue';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getHoverEffectsBackgroundStyles = (props, blockStyle) => {
	const response = {
		g: {},
	};

	breakpoints.forEach(breakpoint => {
		const currentActiveMedia = getLastBreakpointAttribute({
			target: 'h-b_am',
			breakpoint,
			attributes: props,
		});

		if (!currentActiveMedia) return;

		merge(response, {
			...(currentActiveMedia === 'color' && {
				background: getColorBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundColor',
						false,
						'h-'
					),
					blockStyle,
					breakpoint,
					prefix: 'h-',
				}),
			}),
			...(currentActiveMedia === 'gradient' && {
				background: getGradientBackgroundObject({
					...getGroupAttributes(
						props,
						'backgroundGradient',
						false,
						'h-'
					),
					breakpoint,
					prefix: 'h-',
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
						getAttributesValue({
							target: 'h-bg_o',
							props,
						}) || 1
					})`
				);
	});

	return response;
};

export default getHoverEffectsBackgroundStyles;
