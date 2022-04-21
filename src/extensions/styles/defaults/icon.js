import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor, backgroundGradient } from './background';
import { width } from './size';
import padding from './padding';

import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'icon-';

export const icon = {
	'icon-inherit': {
		type: 'boolean',
		default: true,
	},
	'icon-content': {
		type: 'string',
		default: '',
	},
	'icon-only': {
		type: 'boolean',
		default: false,
	},
	'icon-position': {
		type: 'string',
		default: 'right',
	},
	...breakpointAttributesCreator({
		obj: {
			'icon-spacing': {
				type: 'number',
				default: 5,
			},
			'icon-stroke': {
				type: 'number',
				default: 2,
			},
		},
	}),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		diffValAttr: {
			'icon-width-general': 32,
		},
	}),
	...paletteAttributesCreator({ prefix, palette: 1 }),
	...paletteAttributesCreator({ prefix: `${prefix}fill-`, palette: 4 }),
};

export const iconBackground = prefixAttributesCreator({
	obj: background,
	prefix,
	diffValAttr: { 'icon-background-active-media-general': 'none' },
});

export const iconPadding = prefixAttributesCreator({
	obj: padding,
	prefix,
});

export const iconBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix,
	exclAttr: ['background-color-clip-path'],
});

export const iconBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
	exclAttr: ['background-gradient-clip-path'],
});
