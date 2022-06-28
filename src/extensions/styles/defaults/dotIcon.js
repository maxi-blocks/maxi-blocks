import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import { icon } from './icon';
import padding from './padding';
import { background, backgroundColor, backgroundGradient } from './background';

const prefix = 'navigation-dot-';
const prefixIcon = 'navigation-dot-icon-';

export const dotIcon = {
	...prefixAttributesCreator({
		obj: icon,
		prefix,
		diffValAttr: {
			'navigation-dot-icon-width-general': '10',
			'navigation-dot-icon-stroke-palette-color': 5,
			'navigation-dot-icon-fill-palette-color': 3,
		},
		exclAttr: [
			'icon-inherit',
			'icon-only',
			'icon-position',
			'icon-content',
			'icon-spacing',
		],
	}),
	...{
		'navigation-dot-icon-content': {
			type: 'string',
			default:
				'<svg class="circle-2-shape-maxi-svg__3" width="64px" height="64px" viewBox="0 0 36.1 36.1"><circle cx="18" cy="18" r="17.2" data-fill  fill="var(--maxi-light-icon-fill,rgba(var(--maxi-light-color-5,0,0,0),1))"/></svg>',
		},
	},
	...breakpointAttributesCreator({
		obj: {
			'navigation-dot-icon-spacing-horizontal': {
				type: 'number',
				default: 50,
			},
			'navigation-dot-icon-spacing-vertical': {
				type: 'number',
				default: 85,
			},
			'navigation-dot-icon-spacing-between': {
				type: 'number',
				default: 3,
			},
		},
	}),
	...{
		'navigation-dot-svgType': {
			type: 'string',
			default: 'Shape',
		},
	},
};

export const dotIconPadding = prefixAttributesCreator({
	obj: padding,
	prefix: prefixIcon,
});

export const dotIconBackground = prefixAttributesCreator({
	obj: background,
	prefix: prefixIcon,
	diffValAttr: {
		'navigation-dot-icon-background-active-media-general': 'none',
	},
});

export const dotIconBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix: prefixIcon,
	exclAttr: ['background-color-clip-path'],
});

export const dotIconBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix: prefixIcon,
	exclAttr: ['background-gradient-clip-path'],
});
