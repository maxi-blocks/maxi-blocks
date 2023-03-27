import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor, backgroundGradient } from './background';
import { height, width } from './size';
import padding from './padding';

import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'i-'; // icon-

export const icon = {
	st: {
		type: 'string',
		longLabel: 'svgType',
	},
	'i-i': {
		type: 'boolean',
		default: true,
		longLabel: 'icon-inherit',
	},
	'i-c': {
		type: 'string',
		default: '',
		longLabel: 'icon-content',
	},
	'i-on': {
		type: 'boolean',
		default: false,
		longLabel: 'icon-only',
	},
	'i-pos': {
		type: 'string',
		default: 'right',
		longLabel: 'icon-position',
	},
	...breakpointAttributesCreator({
		obj: {
			'i-spa': {
				type: 'number',
				default: 5,
				longLabel: 'icon-spacing',
			},
			'i-spa.u': {
				type: 'string',
				default: '%',
				longLabel: 'icon-spacing-unit',
			},
			'i-si': {
				type: 'number',
				default: 2,
				longLabel: 'icon-size',
			},
		},
	}),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		diffValAttr: {
			'i-w-general': '32',
		},
	}),
	...prefixAttributesCreator({
		obj: height,
		prefix,
		diffValAttr: {
			'i-h-general': '32',
		},
	}),
	...paletteAttributesCreator({ prefix: `${prefix}s-`, palette: 1 }), // stroke
	...paletteAttributesCreator({ prefix: `${prefix}f-`, palette: 4 }), // fill
};

export const iconBackground = prefixAttributesCreator({
	obj: background,
	prefix,
	diffValAttr: { 'i-bam-general': 'none' },
});

export const iconPadding = prefixAttributesCreator({
	obj: padding,
	prefix,
});

export const iconBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix,
	exclAttr: ['bc-cp'],
});

export const iconBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
	exclAttr: ['bg-cp'],
});

export const iconBoxShadow = prefixAttributesCreator({
	obj: boxShadow,
	prefix,
});
