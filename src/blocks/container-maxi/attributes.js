/**
 * Imports
 */
import * as attributesData from '@extensions/styles/defaults/index';
import { transitionAttributesCreator } from '@extensions/styles';
import { customCss } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
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
					'background-color-wrapper-position-sync-general': 'all',
					'background-color-wrapper-width-general': 100,
					'background-color-wrapper-width-unit-general': '%',
					'background-color-wrapper-height-general': 100,
					'background-color-wrapper-height-unit-general': '%',
					'background-color-wrapper-position-bottom-unit-general':
						'px',
					'background-color-wrapper-position-top-unit-general': 'px',
					'background-color-wrapper-position-left-unit-general': 'px',
					'background-color-wrapper-position-right-unit-general':
						'px',
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
		'full-width-general': {
			type: 'boolean',
			default: true,
		},
		'size-advanced-options': {
			type: 'boolean',
			default: true,
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
	...{
		...attributesData.contextLoop,
		'cl-pagination-justify-content-general': {
			type: 'string',
			default: 'space-around',
		},
	},
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		// TODO: bg layer from start
		...transitionAttributesCreator({ selectors: customCss.selectors }),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.opacityHover,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.advancedCss,
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
		'flex-direction-general': {
			type: 'string',
			default: 'column',
		},
	},
};

export default attributes;
