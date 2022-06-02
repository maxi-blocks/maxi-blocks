import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor, backgroundGradient } from './background';
import { icon } from './icon';
import padding from './padding';

const prefixFirst = 'arrow-first-';
const prefixSecond = 'arrow-second-';
const prefixBoth = 'arrow-both-';

export const arrowIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefixFirst,
		diffValAttr: {
			'icon-width-general': '64',
		},
		exclAttr: ['icon-inherit', 'icon-only', 'icon-position'],
	}),
	...prefixAttributesCreator({
		obj: icon,
		prefixSecond,
		diffValAttr: {
			'icon-width-general': '64',
		},
		exclAttr: ['icon-inherit', 'icon-only', 'icon-position'],
	}),
	...prefixAttributesCreator({
		obj: icon,
		prefixBoth,
		diffValAttr: {
			'icon-width-general': '64',
		},
		exclAttr: ['icon-inherit', 'icon-only', 'icon-position'],
	}),
};

export const arrowIconBackground = {
	...prefixAttributesCreator({
		obj: background,
		prefixFirst,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
	...prefixAttributesCreator({
		obj: background,
		prefixSecond,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
	...prefixAttributesCreator({
		obj: background,
		prefixBoth,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
};

export const arrowIconPadding = {
	...prefixAttributesCreator({
		obj: padding,
		prefixFirst,
	}),
	...prefixAttributesCreator({
		obj: padding,
		prefixSecond,
	}),
	...prefixAttributesCreator({
		obj: padding,
		prefixBoth,
	}),
};
export const iconBackgroundColor = {
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefixFirst,
		exclAttr: ['background-color-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefixSecond,
		exclAttr: ['background-color-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefixBoth,
		exclAttr: ['background-color-clip-path'],
	}),
};

export const arrowIconBackgroundGradient = {
	...prefixAttributesCreator({
		obj: backgroundGradient,
		prefixFirst,
		exclAttr: ['background-gradient-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundGradient,
		prefixSecond,
		exclAttr: ['background-gradient-clip-path'],
	}),
	...prefixAttributesCreator({
		obj: backgroundGradient,
		prefixBoth,
		exclAttr: ['background-gradient-clip-path'],
	}),
};
