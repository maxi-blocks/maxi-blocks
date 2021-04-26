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
	parentBlockStyle: {
		type: 'string',
	},
	customLabel: {
		type: 'string',
		default: __('Font Icon', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	...{
		...attributesData.textAlignment,
		'text-alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.palette,
	...attributesData.icon,
	...attributesData.iconHover,
	...attributesData.opacity,
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundGradient,
	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradientHover,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.display,
	...attributesData.position,
	...attributesData.motion,
	...attributesData.transform,
	...attributesData.entrance,
};

export default attributes;
