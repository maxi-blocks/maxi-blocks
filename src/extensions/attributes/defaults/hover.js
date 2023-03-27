import { __ } from '@wordpress/i18n';

import { border, borderWidth, borderRadius } from './border';
import { background, backgroundColor, backgroundGradient } from './background';
import margin from './margin';
import padding from './padding';
import { typography } from './typography';

import prefixAttributesCreator from '../prefixAttributesCreator';

export const hover = {
	'h-ty': {
		type: 'string',
		default: 'none',
		longLabel: 'hover-type',
	},
	'h-pr': {
		type: 'boolean',
		default: true,
		longLabel: 'hover-preview',
	},
	'h-ex': {
		type: 'boolean',
		default: false,
		longLabel: 'hover-extension',
	},
	'h-bet': {
		type: 'string',
		default: 'zoom-in',
		longLabel: 'hover-basic-effect-type',
	},
	'h-tety': {
		type: 'string',
		default: 'fade',
		longLabel: 'hover-text-effect-type',
	},
	'h-tp': {
		type: 'string',
		default: 'center-center',
		longLabel: 'hover-text-preset',
	},
	'h-te': {
		type: 'string',
		default: 'ease',
		longLabel: 'hover-transition-easing',
	},
	'h-tecb': {
		type: 'object',
		longLabel: 'hover-transition-easing-cubic-bezier',
	},
	'h-tdu': {
		type: 'number',
		default: 0.5,
		longLabel: 'hover-transition-duration',
	},
	'h-bziv': {
		type: 'number',
		default: 1.3,
		longLabel: 'hover-basic-zoom-in-value',
	},
	'h-bxov': {
		type: 'number',
		default: 1.5,
		longLabel: 'hover-basic-zoom-out-value',
	},
	'h-bsv': {
		type: 'number',
		default: 30,
		longLabel: 'hover-basic-slide-value',
	},
	'h-brv': {
		type: 'number',
		default: 15,
		longLabel: 'hover-basic-rotate-value',
	},
	'h-bbv': {
		type: 'number',
		default: 2,
		longLabel: 'hover-basic-blur-value',
	},
};

const prefix = 'h-'; // hover-

export const hoverBorder = prefixAttributesCreator({
	obj: border,
	prefix,
	newAttr: {
		'h-bo.s': {
			// hover-border-status
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
	diffValAttr: { 'h-bam': 'color' }, // hover-background-active-media
	newAttr: {
		'h-b.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-background-status',
		},
	},
});

export const hoverBackgroundColor = prefixAttributesCreator({
	obj: backgroundColor,
	prefix,
	diffValAttr: {
		'h-b-pc': 5, // hover-background-palette-color
		'h-b-po': 60, // hover-background-palette-opacity
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
		'h-m.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-margin-status',
		},
	},
});

export const hoverPadding = prefixAttributesCreator({
	obj: padding,
	prefix,
	newAttr: {
		'h-p.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-padding-status',
		},
	},
});

export const hoverTitleTypography = prefixAttributesCreator({
	obj: typography,
	prefix: 'h-ti-', // hover-title-
	diffValAttr: {
		'h-ti-fs-general': 30, // hover-title-font-size-general
		'h-ti-pc-general': 1, // hover-title-palette-color-general
	},
	newAttr: {
		'h-ti-t.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-title-typography-status',
		},
		'h-ti-t-c': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
			longLabel: 'hover-title-typography-content',
		},
	},
});

export const hoverContentTypography = prefixAttributesCreator({
	obj: typography,
	prefix: 'hover-content-',
	diffValAttr: {
		'h-c-fs-general': 18, // hover-content-font-size-general
		'h-c-pc-general': 1, // hover-content-palette-color-general
	},
	newAttr: {
		'h-c-t.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-content-typography-status',
		},
		'h-c-t-c': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
			longLabel: 'hover-content-typography-content',
		},
	},
});
