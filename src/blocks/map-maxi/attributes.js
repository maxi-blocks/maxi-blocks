/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { updateBreakpointAttributes } from '../../extensions/styles';

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
	...attributesData.map,
	customLabel: {
		type: 'string',
		default: __('Map', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...{
		...attributesData.size,
		'height-general': {
			type: 'number',
			default: 300,
		},
		'height-unit-general': {
			type: 'string',
			default: 'px',
		},
	},
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
};

export default updateBreakpointAttributes(attributes);
