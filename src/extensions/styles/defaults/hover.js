import { __ } from '@wordpress/i18n';

import { border, borderWidth, borderRadius } from './border';
import { background, backgroundColor, backgroundGradient } from './background';
import margin from './margin';
import padding from './padding';
import { typography } from './typography';

import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';

export const hover = {
	'hover-type': {
		type: 'string',
		default: 'none',
	},
	'hover-preview': {
		type: 'boolean',
		default: true,
	},
	'hover-extension': {
		type: 'boolean',
		default: false,
	},
	'hover-basic-effect-type': {
		type: 'string',
		default: 'zoom-in',
	},
	'hover-text-effect-type': {
		type: 'string',
		default: 'fade',
	},
	'hover-text-preset': {
		type: 'string',
		default: 'center-center',
	},
	'hover-transition-easing': {
		type: 'string',
		default: 'ease',
	},
	'hover-transition-easing-cubic-bezier': {
		type: 'array',
	},
	'hover-transition-duration': {
		type: 'number',
		default: 0.5,
	},
	'hover-basic-zoom-in-value': {
		type: 'number',
		default: 1.3,
	},
	'hover-basic-zoom-out-value': {
		type: 'number',
		default: 1.5,
	},
	'hover-basic-slide-value': {
		type: 'number',
		default: 30,
	},
	'hover-basic-rotate-value': {
		type: 'number',
		default: 15,
	},
	'hover-basic-blur-value': {
		type: 'number',
		default: 2,
	},
};

const prefix = 'hover-';

export const hoverBorder = prefixAttributesCreator({
	obj: border,
	prefix,
	newAttr: {
		'hover-border-status': {
			type: 'boolean',
			default: false,
		},
	},
});

export const hoverBorderWidth = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
});

export const hoverBorderRadius = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
});

export const hoverBackground = prefixAttributesCreator({
	obj: background,
	prefix,
	diffValAttr: { 'hover-background-active-media': 'color' },
	newAttr: {
		'hover-background-status': {
			type: 'boolean',
			default: false,
		},
	},
});

export const hoverBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix,
	diffValAttr: {
		'hover-background-palette-color': 5,
		'hover-background-palette-opacity': 60,
	},
});

export const hoverBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
});

export const hoverMargin = prefixAttributesCreator({
	obj: margin,
	prefix,
	newAttr: {
		'hover-margin-status': {
			type: 'boolean',
			default: false,
		},
	},
});

export const hoverPadding = prefixAttributesCreator({
	obj: padding,
	prefix,
	newAttr: {
		'hover-padding-status': {
			type: 'boolean',
			default: false,
		},
	},
});

export const hoverTitleTypography = prefixAttributesCreator({
	obj: typography,
	prefix: 'hover-title-',
	diffValAttr: {
		'hover-title-font-size-general': 30,
		'hover-title-palette-color-general': 1,
	},
	newAttr: {
		'hover-title-typography-status': {
			type: 'boolean',
			default: false,
		},
		'hover-title-typography-status-hover': {
			type: 'boolean',
			default: false,
		},
		'hover-title-typography-content': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
		},
	},
});

export const hoverContentTypography = prefixAttributesCreator({
	obj: typography,
	prefix: 'hover-content-',
	diffValAttr: {
		'hover-content-font-size-general': 18,
		'hover-content-palette-color-general': 1,
	},
	newAttr: {
		'hover-content-typography-status': {
			type: 'boolean',
			default: false,
		},
		'hover-content-typography-status-hover': {
			type: 'boolean',
			default: false,
		},
		'hover-content-typography-content': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
		},
	},
});
