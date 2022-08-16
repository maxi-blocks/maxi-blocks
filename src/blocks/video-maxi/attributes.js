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

	...attributesData.video,
	...attributesData.videoOverlay,
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
		},
	}),

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
