import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor, backgroundGradient } from './background';
import { height, width } from './size';
import padding from './padding';

import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import boxShadow from './boxShadow';
import attributesShorter from '../dictionary/attributesShorter';

const prefix = 'icon-';

export const icon = attributesShorter(
	{
		svgType: {
			type: 'string',
		},
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
				'icon-spacing-unit': {
					type: 'string',
					default: '%',
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
				'icon-width-general': '32',
			},
		}),
		...prefixAttributesCreator({
			obj: height,
			prefix,
			diffValAttr: {
				'icon-height-general': '32',
			},
		}),
		...paletteAttributesCreator({ prefix: `${prefix}stroke-`, palette: 1 }),
		...paletteAttributesCreator({ prefix: `${prefix}fill-`, palette: 4 }),
	},
	'icon'
);

export const iconBackground = attributesShorter(
	prefixAttributesCreator({
		obj: background,
		prefix,
		diffValAttr: { 'icon-background-active-media-general': 'none' },
	}),
	'background'
);

export const iconPadding = attributesShorter(
	prefixAttributesCreator({
		obj: padding,
		prefix,
	}),
	'padding'
);

export const iconBackgroundColor = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		exclAttr: ['background-color-clip-path'],
	}),
	'background'
);

export const iconBackgroundGradient = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundGradient,
		prefix,
		exclAttr: ['background-gradient-clip-path'],
	}),
	'background'
);

export const iconBoxShadow = attributesShorter(
	prefixAttributesCreator({
		obj: boxShadow,
		prefix,
	}),
	'boxShadow'
);
