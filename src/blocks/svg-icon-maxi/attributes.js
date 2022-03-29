/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';
import { prefixAttributesCreator } from '../../extensions/styles';

/**
 * Attributes
 */
const prefix = 'svg-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	customLabel: {
		type: 'string',
		default: __('SVG Icon', 'maxi-blocks'),
	},
	openFirstTime: {
		type: 'boolean',
		default: true,
	},
	svgType: {
		type: 'string',
	},
	content: {
		type: 'string',
	},
	...attributesData.svg,
	...{
		...attributesData.alignment,
		'alignment-general': {
			type: 'string',
			default: 'center',
		},
	},
	...prefixAttributesCreator({
		obj: attributesData.background,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColor,
		prefix,
		diffValAttr: { [`${prefix}background-palette-color-general`]: 4 },
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundGradient,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.backgroundHover, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.backgroundColorHover,
		prefix,
	}),
	...prefixAttributesCreator({
		obj: attributesData.backgroundGradientHover,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.border, prefix }),
	...prefixAttributesCreator({ obj: attributesData.borderHover, prefix }),
	...prefixAttributesCreator({ obj: attributesData.borderRadius, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderRadiusHover,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.borderWidth, prefix }),
	...prefixAttributesCreator({
		obj: attributesData.borderWidthHover,
		prefix,
	}),
	...prefixAttributesCreator({ obj: attributesData.boxShadow, prefix }),
	...prefixAttributesCreator({ obj: attributesData.boxShadowHover, prefix }),
	...prefixAttributesCreator({ obj: attributesData.margin, prefix }),
	...prefixAttributesCreator({ obj: attributesData.padding, prefix }),

	/**
	 * Canvas styles
	 */
	blockFullWidth: {
		type: 'string',
		default: 'normal',
	},
	...attributesData.blockBackground,
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.opacity,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;
