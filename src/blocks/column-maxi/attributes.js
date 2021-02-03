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
		default: __('Column', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	verticalAlign: {
		type: 'string',
		default: 'stretch',
	},
	extraClassName: {
		type: 'string',
		default: '',
	},
	extraStyles: {
		type: 'string',
		default: '',
	},
	...newAttributes.columnSize,
	...newAttributes.opacity,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundImage,
	...newAttributes.backgroundVideo,
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundSVG,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundImageHover,
	...newAttributes.backgroundVideoHover,
	...newAttributes.backgroundGradientHover,
	...newAttributes.backgroundSVGHover,
	...newAttributes.border,
	...newAttributes.borderWidth,
	...newAttributes.borderRadius,
	...newAttributes.borderHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.margin,
	...newAttributes.padding,
	...newAttributes.display,
	...newAttributes.transform,
	...newAttributes.zIndex,
};

export default attributes;
