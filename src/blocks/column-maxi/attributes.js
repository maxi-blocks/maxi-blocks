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
	...attributesData.background,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.columnSize,
	...attributesData.display,
	...attributesData.margin,
	...attributesData.opacity,
	...attributesData.overflow,
	...attributesData.padding,
	...attributesData.transform,
	...attributesData.zIndex,
};

export default attributes;
