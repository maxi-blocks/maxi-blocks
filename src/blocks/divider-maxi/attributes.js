/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';

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
	...attributesData.size,
	'height-general': {
		default: 100,
	},
	'height-unit-general': {
		default: 'px',
	},
	...attributesData.divider,
	...attributesData.highlight,
	...attributesData.opacity,
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundGradient,
	...attributesData.backgroundHover,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradientHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.padding,
	...attributesData.margin,
	...attributesData.display,
	...attributesData.position,
	...attributesData.entrance,
	...attributesData.motion,
	...attributesData.transform,
	...attributesData.zIndex,
};
export default attributes;
