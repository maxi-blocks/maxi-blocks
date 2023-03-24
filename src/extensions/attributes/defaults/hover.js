import { __ } from '@wordpress/i18n';

import { border, borderWidth, borderRadius } from './border';
import { background, backgroundColor, backgroundGradient } from './background';
import margin from './margin';
import padding from './padding';
import { typography } from './typography';

import prefixAttributesCreator from '../prefixAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

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
		type: 'object',
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

export const hoverBorder = attributesShorter(
	prefixAttributesCreator({
		obj: border,
		prefix,
		newAttr: {
			'hover-border-status': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'hover'
);

export const hoverBorderWidth = attributesShorter(
	prefixAttributesCreator({
		obj: borderWidth,
		prefix,
	}),
	'hover'
);

export const hoverBorderRadius = attributesShorter(
	prefixAttributesCreator({
		obj: borderRadius,
		prefix,
	}),
	'hover'
);

export const hoverBackground = attributesShorter(
	prefixAttributesCreator({
		obj: background,
		prefix,
		diffValAttr: { 'hover-background-active-media': 'color' },
		newAttr: {
			'hover-background-status': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'hover'
);

export const hoverBackgroundColor = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		diffValAttr: {
			'hover-background-palette-color': 5,
			'hover-background-palette-opacity': 60,
		},
	}),
	'hover'
);

export const hoverBackgroundGradient = attributesShorter(
	prefixAttributesCreator({
		obj: backgroundGradient,
		prefix,
	}),
	'hover'
);

export const hoverMargin = attributesShorter(
	prefixAttributesCreator({
		obj: margin,
		prefix,
		newAttr: {
			'hover-margin-status': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'hover'
);

export const hoverPadding = attributesShorter(
	prefixAttributesCreator({
		obj: padding,
		prefix,
		newAttr: {
			'hover-padding-status': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'hover'
);

export const hoverTitleTypography = attributesShorter(
	prefixAttributesCreator({
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
			'hover-title-typography-content': {
				type: 'string',
				default: __('Add your Hover Title here', 'maxi-blocks'),
			},
		},
	}),
	'hover'
);

export const hoverContentTypography = attributesShorter(
	prefixAttributesCreator({
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
			'hover-content-typography-content': {
				type: 'string',
				default: __('Add your Hover Title here', 'maxi-blocks'),
			},
		},
	}),
	'hover'
);
