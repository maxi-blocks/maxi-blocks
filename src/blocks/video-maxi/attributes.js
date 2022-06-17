/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { prefixAttributesCreator } from '../../extensions/styles';

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */

	customLabel: {
		type: 'string',
		default: __('Video', 'maxi-blocks'),
	},

	...attributesData.video,
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix: 'lightbox-',
		diffValAttr: {
			'lightbox-background-active-media-general': 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix: 'lightbox-',
		diffValAttr: {
			'lightbox-background-palette-color-general': 5,
			'lightbox-background-palette-opacity-general': 0.7,
		},
	}),

	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix: 'overlay-',
		diffValAttr: {
			'overlay-background-active-media-general': 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix: 'overlay-',
		diffValAttr: { 'overlay-background-palette-color-general': 2 },
	}),

	'overlay-mediaID': {
		type: 'number',
	},
	'overlay-mediaURL': {
		type: 'string',
	},
	'overlay-altSelector': {
		type: 'string',
		default: 'wordpress',
	},
	'overlay-mediaAlt': {
		type: 'string',
	},

	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderWidth,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.transform,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;
