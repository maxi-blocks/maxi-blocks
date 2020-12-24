/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as newAttributes from '../../extensions/styles/defaults/index';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Container', 'maxi-blocks'),
	},
	fullWidth: {
		type: 'string',
		default: 'full',
	},
	background: {
		type: 'object',
		default: attributesData.background,
	},
	backgroundHover: {
		type: 'object',
		default: attributesData.backgroundHover,
	},
	shapeDivider: {
		type: 'object',
		default: attributesData.shapeDivider,
	},
	position: {
		type: 'object',
		default: attributesData.position,
	},
	display: {
		type: 'object',
		default: attributesData.display,
	},
	motion: {
		type: 'object',
		default: attributesData.motion,
	},
	transform: {
		type: 'object',
		default: attributesData.transform,
	},
	...newAttributes.container,
	...newAttributes.size,
	...newAttributes.opacity,
	...newAttributes.border,
	...newAttributes.borderHover,
	...newAttributes.boxShadow,
	...newAttributes.boxShadowHover,
	...newAttributes.margin,
	...newAttributes.padding,
	...newAttributes.arrow,
};

export default attributes;
