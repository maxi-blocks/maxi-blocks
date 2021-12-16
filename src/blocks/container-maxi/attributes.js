/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.container,
	customLabel: {
		type: 'string',
		default: __('Container', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'full',
	},
	blockStyle: {
		type: 'string',
		default: 'maxi-light',
	},
	updateStyleCard: {
		type: 'number',
		default: 0,
	},
	...attributesData.arrow,
	...attributesData.shapeDivider,
	...{
		...attributesData.blockBackground,
		'background-layers': {
			type: 'array',
			default: [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-color-status-general': true,
					'background-palette-color-general': 1,
					'background-palette-opacity': 100,
					'background-color-general': '',
					'background-color-clip-path-general': '',
					id: 0,
				},
			],
		},
	},
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...{
		...attributesData.padding,
		'padding-top-general': {
			type: 'number',
			default: 20,
		},
		'padding-bottom-general': {
			type: 'number',
			default: 20,
		},
	},

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
};

export default attributes;
