/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	customLabel: {
		type: 'string',
		default: __('Container', 'maxi-blocks'),
	},
	blockFullWidth: {
		type: 'string',
		default: 'full',
	},
	...attributesData.arrow,
	...attributesData.shapeDivider,
	...{
		...attributesData.blockBackground,
		'background-layers': {
			type: 'array',
			default: [
				{
					type: 'color',
					'display-general': 'block',
					'background-palette-status-general': true,
					'background-palette-color-general': 1,
					'background-palette-opacity-general': 1,
					'background-color-general': undefined,
					'background-color-clip-path-general': '',
					order: 1,
					id: 1,
				},
			],
		},
	},
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...{
		...attributesData.size,
		'size-advanced-options': {
			type: 'boolean',
			default: true,
		},
		'max-width-xxl': {
			type: 'string',
			default: '1690',
		},
		'max-width-xl': {
			type: 'string',
			default: '1170',
		},
		'max-width-l': {
			type: 'string',
			default: '90',
		},
		'max-width-unit-xxl': {
			type: 'string',
			default: 'px',
		},
		'max-width-unit-xl': {
			type: 'string',
			default: 'px',
		},
		'max-width-unit-l': {
			type: 'string',
			default: '%',
		},
		'width-l': {
			type: 'string',
			default: '1170',
		},
		'width-m': {
			type: 'string',
			default: '1000',
		},
		'width-s': {
			type: 'string',
			default: '700',
		},
		'width-xs': {
			type: 'string',
			default: '460',
		},
		'width-unit-l': {
			type: 'string',
			default: 'px',
		},
	},
	...attributesData.margin,
	...{
		...attributesData.padding,
		'padding-top-general': {
			type: 'string',
			default: '20',
		},
		'padding-bottom-general': {
			type: 'string',
			default: '20',
		},
	},

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...attributesData.transition,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...{
		...attributesData.flex,
		'row-gap-general': {
			type: 'number',
			default: 20,
		},
		'row-gap-unit-general': {
			type: 'string',
			default: 'px',
		},
	},
};

export default attributes;
