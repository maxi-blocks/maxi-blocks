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

	/**
	 * Block styles
	 */
	customLabel: {
		type: 'string',
		default: __('Row', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	horizontalAlign: {
		type: 'string',
		default: 'space-between',
	},
	verticalAlign: {
		type: 'string',
		default: 'stretch',
	},
	removeColumnGap: {
		type: 'boolean',
		default: false,
	},
	...attributesData.rowPattern,
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...{
		...attributesData.size,
		'max-width-xxl': {
			type: 'number',
			default: 1690,
		},
		'max-width-xl': {
			type: 'number',
			default: 1170,
		},
		'max-width-l': {
			type: 'number',
			default: 90,
		},
		'max-width-unit-xxl': {
			type: 'string',
			default: 'px',
		},
		'max-width-unit-xl': {
			type: 'string',
			default: 'px',
		},
		'max-width-unit-l': {
			type: 'string',
			default: '%',
		},
		'width-l': {
			type: 'number',
			default: 1170,
		},
		'width-m': {
			type: 'number',
			default: 1000,
		},
		'width-s': {
			type: 'number',
			default: 700,
		},
		'width-xs': {
			type: 'number',
			default: 460,
		},
		'width-unit-l': {
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
	...attributesData.transition,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;
