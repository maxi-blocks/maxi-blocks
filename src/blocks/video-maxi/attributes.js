/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import {
	prefixAttributesCreator,
	transitionAttributesCreator,
} from '@extensions/styles';
import { customCss, transition } from './data';

const prefix = 'video-';

const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */

	...attributesData.video,
	...attributesData.videoOverlay,
	...attributesData.videoPopup,
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
	...attributesData.borderWidth,
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
	...attributesData.advancedCss,
	...attributesData.flex,

	/**
	 * Popup animation duration settings
	 * Stores the numeric value and unit to control popup zoom animation speed
	 */
	popupAnimationDuration: {
		type: 'number',
	},
	popupAnimationDurationUnit: {
		type: 'string',
	},
};

export default attributes;
