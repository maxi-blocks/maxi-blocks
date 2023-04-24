import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor, backgroundGradient } from './background';
import { height, width } from './size';
import padding from './padding';

import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'i-';
const longPrefix = 'icon-';

export const icon = {
	_st: {
		type: 'string',
		longLabel: 'svgType',
	},
	i_i: {
		type: 'boolean',
		default: true,
		longLabel: 'icon-inherit',
	},
	i_c: {
		type: 'string',
		default: '',
		longLabel: 'icon-content',
	},
	i_on: {
		type: 'boolean',
		default: false,
		longLabel: 'icon-only',
	},
	i_pos: {
		type: 'string',
		default: 'right',
		longLabel: 'icon-position',
	},
	...breakpointAttributesCreator({
		obj: {
			i_spa: {
				type: 'number',
				default: 5,
				longLabel: 'icon-spacing',
			},
			'i_spa.u': {
				type: 'string',
				default: '%',
				longLabel: 'icon-spacing-unit',
			},
			i_str: {
				type: 'number',
				default: 2,
				longLabel: 'icon-stroke',
			},
		},
	}),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		longPrefix,
		diffValAttr: {
			'i_w-general': '32',
		},
	}),
	...prefixAttributesCreator({
		obj: height,
		prefix,
		longPrefix,
		diffValAttr: {
			'i_h-general': '32',
		},
	}),
	...paletteAttributesCreator({
		prefix: `${prefix}str-`,
		longPrefix: `${longPrefix}stroke-`,
		palette: 1,
	}),
	...paletteAttributesCreator({
		prefix: `${prefix}f-`,
		longPrefix: `${longPrefix}fill-`,
		palette: 4,
	}),
};

export const iconBackground = prefixAttributesCreator({
	obj: background,
	prefix,
	longPrefix,
	diffValAttr: { 'i-b_am-general': 'none' }, // icon-background-active-media-general
});

export const iconPadding = prefixAttributesCreator({
	obj: padding,
	prefix,
	longPrefix,
});

export const iconBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix,
	longPrefix,
	exclAttr: ['bc_cp'], // background-color-color-palette
});

export const iconBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
	longPrefix,
	exclAttr: ['bg_cp'], // background-gradient-color-palette
});

export const iconBoxShadow = prefixAttributesCreator({
	obj: boxShadow,
	prefix,
	longPrefix,
});
