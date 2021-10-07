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
	customLabel: {
		type: 'string',
		default: __('Container', 'maxi-blocks'),
	},
	fullWidth: {
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
	...attributesData.container,
	...{
		...attributesData.background,
		'background-layers': {
			type: 'array',
			default: [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-color-status-general': true,
					'background-palette-color-general': 1,
					'background-color-general': '',
					'background-color-clip-path-general': '',
					id: 0,
				},
			],
		},
	},
	...attributesData.size,
	...attributesData.opacity,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
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
	...attributesData.arrow,
	...attributesData.shapeDivider,
	...attributesData.motion,
	...attributesData.parallax,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.zIndex,
	...attributesData.overflow,
};

export default attributes;
