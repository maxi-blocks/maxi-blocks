/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as newAttributes from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Font Icon', 'maxi-blocks'),
	},
	...newAttributes.icon,
	...{
		...newAttributes.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...newAttributes.opacity,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundGradientHover,
	...newAttributes.border,
	...newAttributes.borderWidth,
	...newAttributes.borderRadius,
	...newAttributes.borderHover,
	...newAttributes.borderWidthHover,
	...newAttributes.borderRadiusHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.margin,
	...newAttributes.padding,
	...newAttributes.display,
	...newAttributes.position,
	...newAttributes.motion,
	...newAttributes.transform,
	...newAttributes.highlight,
};

export default attributes;
