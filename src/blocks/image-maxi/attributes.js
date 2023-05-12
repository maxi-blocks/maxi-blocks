/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { prefixAttributesCreator } from '../../extensions/attributes';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss, transition } from './data';

/**
 * Attributes
 */
const prefix = 'im-';
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...{
		...attributesData.alignment,
		'_a-general': {
			type: 'string',
			default: 'center',
		},
	},
	...attributesData.image,
	...attributesData.clipPath,
	...attributesData.clipPathHover,
	...attributesData.link,
	...attributesData.textAlignment,
	...attributesData.typography,
	...attributesData.imageShape,
	...attributesData.hover,
	...attributesData.hoverBackground,
	...attributesData.hoverBackgroundColor,
	...attributesData.hoverBackgroundGradient,
	...attributesData.hoverBorder,
	...attributesData.hoverBorderRadius,
	...attributesData.hoverBorderWidth,
	...attributesData.hoverContentTypography,
	...attributesData.hoverMargin,
	...attributesData.hoverPadding,
	...attributesData.hoverTitleTypography,
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
	...prefixAttributesCreator({ obj: attributesData.size, prefix }),
	...prefixAttributesCreator({ obj: attributesData.padding, prefix }),

	/**
	 * Canvas styles
	 */
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
	...attributesData.opacityHover,
	...attributesData.size,
	...attributesData.margin,
	...attributesData.padding,

	/**
	 * Advanced
	 */
	...attributesData.dynamicContent,
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator({
			transition,
			selectors: customCss.selectors,
		}),
	},
	...attributesData.display,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;
