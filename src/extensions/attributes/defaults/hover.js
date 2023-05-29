import { __ } from '@wordpress/i18n';

import { border, borderWidth, borderRadius } from './border';
import { background, backgroundColor, backgroundGradient } from './background';
import margin from './margin';
import padding from './padding';
import { typography } from './typography';

import prefixAttributesCreator from '../prefixAttributesCreator';

export const hover = {
	h_ty: {
		type: 'string',
		default: 'none',
		longLabel: 'hover-type',
	},
	h_pr: {
		type: 'boolean',
		default: true,
		longLabel: 'hover-preview',
	},
	h_ex: {
		type: 'boolean',
		default: false,
		longLabel: 'hover-extension',
	},
	h_bet: {
		type: 'string',
		default: 'zoom-in',
		longLabel: 'hover-basic-effect-type',
	},
	h_tety: {
		type: 'string',
		default: 'fade',
		longLabel: 'hover-text-effect-type',
	},
	h_tp: {
		type: 'string',
		default: 'center-center',
		longLabel: 'hover-text-preset',
	},
	h_te: {
		type: 'string',
		default: 'ease',
		longLabel: 'hover-transition-easing',
	},
	h_tecb: {
		type: 'object',
		longLabel: 'hover-transition-easing-cubic-bezier',
	},
	h_tdu: {
		type: 'number',
		default: 0.5,
		longLabel: 'hover-transition-duration',
	},
	h_bziv: {
		type: 'number',
		default: 1.3,
		longLabel: 'hover-basic-zoom-in-value',
	},
	h_bzov: {
		type: 'number',
		default: 1.5,
		longLabel: 'hover-basic-zoom-out-value',
	},
	h_bsv: {
		type: 'number',
		default: 30,
		longLabel: 'hover-basic-slide-value',
	},
	h_brv: {
		type: 'number',
		default: 15,
		longLabel: 'hover-basic-rotate-value',
	},
	h_bbv: {
		type: 'number',
		default: 2,
		longLabel: 'hover-basic-blur-value',
	},
};

const prefix = 'h-';
const longPrefix = 'hover-';

export const hoverBorder = prefixAttributesCreator({
	obj: border,
	prefix,
	longPrefix,
	newAttr: {
		'h-bo.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-border-status',
		},
	},
});

export const hoverBorderWidth = prefixAttributesCreator({
	obj: borderWidth,
	prefix,
	longPrefix,
});

export const hoverBorderRadius = prefixAttributesCreator({
	obj: borderRadius,
	prefix,
	longPrefix,
});

export const hoverBackground = prefixAttributesCreator({
	obj: background,
	prefix,
	longPrefix,
	diffValAttr: { 'h-b_am': 'color' }, // hover-background-active-media
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
	longPrefix,
	diffValAttr: {
		'h-bc_pc': 5, // hover-background-palette-color
		'h-bc_po': 60, // hover-background-palette-opacity
	},
});

export const hoverBackgroundGradient = prefixAttributesCreator({
	obj: backgroundGradient,
	prefix,
	longPrefix,
});

export const hoverMargin = prefixAttributesCreator({
	obj: margin,
	prefix,
	longPrefix,
	newAttr: {
		'h_m.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-margin-status',
		},
	},
});

export const hoverPadding = prefixAttributesCreator({
	obj: padding,
	prefix,
	longPrefix,
	newAttr: {
		'h_p.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-padding-status',
		},
	},
});

export const hoverTitleTypography = prefixAttributesCreator({
	obj: typography,
	prefix: 'h-ti-',
	longPrefix: 'hover-title-',
	diffValAttr: {
		'h-ti_fs-g': 30, // hover-title-font-size-g
		'h-ti_pc-g': 1, // hover-title-palette-color-g
	},
	newAttr: {
		'h-ti-t.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-title-typography-status',
		},
		'h-ti-t_c': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
			longLabel: 'hover-title-typography-content',
		},
	},
});

export const hoverContentTypography = prefixAttributesCreator({
	obj: typography,
	prefix: 'hc-',
	longPrefix: 'hover-content-',
	diffValAttr: {
		'hc_fs-g': 18, // hover-content-font-size-g
		'hc_pc-g': 1, // hover-content-palette-color-g
	},
	newAttr: {
		'hc-t.s': {
			type: 'boolean',
			default: false,
			longLabel: 'hover-content-typography-status',
		},
		'hc-t_c': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
			longLabel: 'hover-content-typography-content',
		},
	},
});
