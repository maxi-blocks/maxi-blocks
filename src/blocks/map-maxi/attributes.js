/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import { prefixAttributesCreator } from '../../extensions/styles';
import * as attributesData from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const prefix = 'popup-';
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
	...attributesData.typography,
	...prefixAttributesCreator({
		obj: attributesData.typography,
		prefix: 'description-',
		diffValAttr: {
			'description-font-size-general': 16,
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.svg,
		prefix: '',
		diffValAttr: {
			'svg-width-general': 20,
			'svg-fill-palette-opacity': 1,
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.svg,
		prefix,
		diffValAttr: {
			[`${prefix}svg-stroke-general`]: 1,
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix,
		diffValAttr: {
			[`${prefix}background-active-media-general`]: 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix,
	}),
	...attributesData.border,
	...prefixAttributesCreator({
		obj: attributesData.border,
		prefix,
		diffValAttr: {
			[`${prefix}border-style-general`]: 'solid',
			[`${prefix}border-palette-color-general`]: 4,
		},
	}),
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...prefixAttributesCreator({
		obj: attributesData.borderWidth,
		prefix,
	}),
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...prefixAttributesCreator({
		obj: attributesData.boxShadow,
		prefix,
	}),
	...attributesData.boxShadowHover,
	...prefixAttributesCreator({
		obj: attributesData.boxShadowHover,
		prefix,
	}),
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
	...attributesData.flex,
};

export default attributes;
