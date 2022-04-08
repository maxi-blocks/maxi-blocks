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
	blockStyle: {
		type: 'string',
		default: 'maxi-light',
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
					'background-palette-opacity': 1,
					'background-color-general': '',
					'background-color-clip-path-general': '',
					order: 0,
					id: 0,
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
		'max-width-xxl': {
			type: 'number',
			default: 1690,
		},
		'max-width-xl': {
			type: 'number',
			default: 1170,
		},
		'max-width-l': {
			type: 'number',
			default: 90,
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
			type: 'number',
			default: 1170,
		},
		'width-m': {
			type: 'number',
			default: 1000,
		},
		'width-s': {
			type: 'number',
			default: 700,
		},
		'width-xs': {
			type: 'number',
			default: 460,
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
			type: 'number',
			default: 20,
		},
		'padding-bottom-general': {
			type: 'number',
			default: 20,
		},
	},

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...attributesData.transitionDuration,
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;
