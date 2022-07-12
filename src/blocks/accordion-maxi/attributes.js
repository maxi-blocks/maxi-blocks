/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import {
	breakpointAttributesCreator,
	hoverAttributesCreator,
	paletteAttributesCreator,
	transitionAttributesCreator,
} from '../../extensions/styles';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */

	customLabel: {
		type: 'string',
		default: __('Accordion', 'maxi-blocks'),
	},

	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	lastIndex: {
		type: 'number',
		default: 2,
	},

	...attributesData.accordion,

	'background-status-hover': { type: 'boolean', default: false },
	'active-background-status-hover': { type: 'boolean', default: false },
	...breakpointAttributesCreator({
		obj: {
			...paletteAttributesCreator({ prefix: 'background-', palette: 1 }),
			...paletteAttributesCreator({
				prefix: 'active-background-',
				palette: 1,
			}),
			...hoverAttributesCreator({
				obj: {
					...paletteAttributesCreator({
						prefix: 'background-',
						palette: 1,
					}),
					...paletteAttributesCreator({
						prefix: 'active-background-',
						palette: 1,
					}),
				},
			}),
		},
	}),

	/**
	 * Advanced
	 */
	...attributesData.blockBackground,
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator(),
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;
