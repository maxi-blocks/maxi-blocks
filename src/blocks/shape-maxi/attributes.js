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
		default: __('Shape', 'maxi-blocks'),
	},
	openFirstTime: {
		type: 'boolean',
		default: true,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	shapeSVGElement: {
		type: 'string',
	},
	shapeSVGData: {
		type: 'object',
	},
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundHover,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.display,
	...attributesData.entrance,
	...attributesData.margin,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.padding,
	...attributesData.position,
	...attributesData.shape,
	...attributesData.transform,
	...attributesData.zIndex,
};

export default attributes;
