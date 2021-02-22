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
	'width-general': {
		default: 50,
	},
	'width-unit-general': {
		default: 'px',
	},
	'height-general': {
		default: 100,
	},
	'height-unit-general': {
		default: 'px',
	},
	...attributesData.background,
	...attributesData.backgroundColor,
	...attributesData.backgroundColorHover,
	...attributesData.backgroundGradient,
	...attributesData.backgroundGradientHover,
	...attributesData.backgroundHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.display,
	...attributesData.divider,
	...attributesData.entrance,
	...attributesData.highlight,
	...attributesData.margin,
	...attributesData.motion,
	...attributesData.opacity,
	...attributesData.padding,
	...attributesData.position,
	...attributesData.transform,
	...attributesData.zIndex,
};
export default attributes;
