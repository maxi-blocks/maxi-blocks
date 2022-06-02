import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor, backgroundGradient } from './background';
import { icon } from './icon';
import padding from './padding';
import { border, borderWidth, borderRadius } from './border';

const prefixFirst = 'navigation-arrow-first-';
const prefixSecond = 'navigation-arrow-second-';
const prefixBoth = 'navigation-arrow-both-';

export const arrowIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefix: prefixFirst,
		diffValAttr: {
			'icon-width-general': '64',
			'icon-content':
				'<svg class="circle-arrow-left-5-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="12" r="10.5"/><path d="M14.1 16.2L9.9 12l4.2-4.2" stroke-linecap="round" stroke-miterlimit="10"/></svg>"',
		},
		exclAttr: ['icon-inherit', 'icon-only', 'icon-position'],
	}),
	...prefixAttributesCreator({
		obj: icon,
		prefix: prefixSecond,
		diffValAttr: {
			'icon-width-general': '64',
			'icon-content':
				'<svg class="circle-arrow-right-5-line-maxi-svg" width="64px" height="64px" viewBox="0 0 24 24" fill="none" data-stroke stroke="#081219" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="12" r="10.5"/><path d="M9.9 7.8l4.2 4.2-4.2 4.2" stroke-linecap="round" stroke-miterlimit="10"/></svg>',
		},
		exclAttr: ['icon-inherit', 'icon-only', 'icon-position'],
	}),
	...prefixAttributesCreator({
		obj: icon,
		prefix: prefixBoth,
		diffValAttr: {
			'icon-width-general': '64',
		},
		exclAttr: [
			'icon-inherit',
			'icon-only',
			'icon-position',
			'icon-content',
		],
	}),
};

export const arrowIconBackground = {
	...prefixAttributesCreator({
		obj: background,
		prefix: prefixFirst,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
	...prefixAttributesCreator({
		obj: background,
		prefix: prefixSecond,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
	...prefixAttributesCreator({
		obj: background,
		prefix: prefixBoth,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
};

export const arrowIconPadding = {
	...prefixAttributesCreator({
		obj: padding,
		prefix: prefixFirst,
	}),
	...prefixAttributesCreator({
		obj: padding,
		prefix: prefixSecond,
	}),
	...prefixAttributesCreator({
		obj: padding,
		prefix: prefixBoth,
	}),
};
export const arrowIconBackgroundColor = {
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix: prefixFirst,
		exclAttr: ['background-color-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix: prefixSecond,
		exclAttr: ['background-color-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix: prefixBoth,
		exclAttr: ['background-color-clip-path'],
	}),
};

export const arrowIconBackgroundGradient = {
	...prefixAttributesCreator({
		obj: backgroundGradient,
		prefix: prefixFirst,
		exclAttr: ['background-gradient-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundGradient,
		prefix: prefixSecond,
		exclAttr: ['background-gradient-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundGradient,
		prefix: prefixBoth,
		exclAttr: ['background-gradient-clip-path'],
	}),
};

export const arrowIconBorder = {
	...prefixAttributesCreator({
		obj: border,
		prefix: prefixFirst,
	}),
	...prefixAttributesCreator({
		obj: border,
		prefix: prefixSecond,
	}),
	...prefixAttributesCreator({
		obj: border,
		prefix: prefixBoth,
	}),
};

export const arrowIconBorderWidth = {
	...prefixAttributesCreator({
		obj: borderWidth,
		prefix: prefixFirst,
	}),
	...prefixAttributesCreator({
		obj: borderWidth,
		prefix: prefixSecond,
	}),
	...prefixAttributesCreator({
		obj: borderWidth,
		prefix: prefixBoth,
	}),
};

export const arrowIconBorderRadius = {
	...prefixAttributesCreator({
		obj: borderRadius,
		prefix: prefixFirst,
		diffValAttr: { 'icon-border-unit-radius-general': 'px' },
	}),
	...prefixAttributesCreator({
		obj: borderRadius,
		prefix: prefixSecond,
		diffValAttr: { 'icon-border-unit-radius-general': 'px' },
	}),
	...prefixAttributesCreator({
		obj: borderRadius,
		prefix: prefixBoth,
		diffValAttr: { 'icon-border-unit-radius-general': 'px' },
	}),
};
