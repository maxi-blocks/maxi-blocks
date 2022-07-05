import prefixAttributesCreator from '../prefixAttributesCreator';
import { icon } from './icon';
import { background, backgroundColor, backgroundGradient } from './background';

const prefix = 'navigation-active-dot-';
const prefixIcon = 'navigation-active-dot-icon-';

export const dotIconActive = prefixAttributesCreator({
	obj: icon,
	prefix,
	diffValAttr: {
		[`${prefix}icon-width-general`]: '10',
		[`${prefix}icon-stroke-palette-color`]: 2,
		[`${prefix}icon-fill-palette-color`]: 5,
	},
	newAttr: {
		[`${prefix}icon-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-stroke-palette-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-fill-palette-status`]: {
			type: 'boolean',
			default: true,
		},
	},
	exclAttr: [
		'icon-inherit',
		'icon-only',
		'icon-position',
		'icon-content',
		'icon-spacing',
	],
});

export const dotIconActiveBackground = prefixAttributesCreator({
	obj: background,
	prefix: prefixIcon,
	newAttr: {
		'navigation-active-dot-icon-status-background': {
			type: 'boolean',
			default: false,
		},
	},
	diffValAttr: {
		'navigation-active-dot-icon-background-active-media-general': 'none',
	},
});

export const dotIconActiveBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix: prefixIcon,
	exclAttr: ['background-color-clip-path'],
});

export const dotIconActiveBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix: prefixIcon,
	exclAttr: ['background-gradient-clip-path'],
});
