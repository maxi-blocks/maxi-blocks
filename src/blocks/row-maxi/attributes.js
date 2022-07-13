/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { transitionAttributesCreator } from '../../extensions/styles';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
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
		'size-advanced-options': {
			type: 'boolean',
			default: true,
		},
		'max-width-xxl': {
			type: 'string',
			default: '1690',
		},
		'max-width-xl': {
			type: 'string',
			default: '1170',
		},
		'max-width-l': {
			type: 'string',
			default: '90',
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
	},
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator(),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...{
		...attributesData.flex,
		'row-gap-general': {
			type: 'number',
			default: 20,
		},
		'row-gap-unit-general': {
			type: 'string',
			default: 'px',
		},
		'column-gap-general': {
			type: 'number',
			default: 2.5,
		},
		'column-gap-unit-general': {
			type: 'string',
			default: '%',
		},
	},
	...attributesData.scroll,
};

export default attributes;
