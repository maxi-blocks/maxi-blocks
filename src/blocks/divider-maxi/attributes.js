/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as newAttributes from '../../extensions/styles/defaults/index';
import size from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Divider', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	lineVertical: {
		type: 'string',
		default: 'center',
	},
	lineHorizontal: {
		type: 'string',
		default: 'center',
	},
	lineOrientation: {
		type: 'string',
		default: 'horizontal',
	},
	lineAlign: {
		type: 'string',
		default: 'row',
	},
	...newAttributes.divider,
	...newAttributes.highlight,
	...newAttributes.size,
	...newAttributes.opacity,
	...newAttributes.background,
	...newAttributes.backgroundColor,
	...newAttributes.backgroundGradient,
	...newAttributes.backgroundHover,
	...newAttributes.backgroundColorHover,
	...newAttributes.backgroundGradientHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.padding,
	...newAttributes.margin,
	...newAttributes.display,
	...newAttributes.position,
	...newAttributes.entrance,
	...newAttributes.motion,
	...newAttributes.transform,
};

export default attributes;
