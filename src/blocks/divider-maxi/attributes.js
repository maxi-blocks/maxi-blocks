/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import size from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Divider', 'maxi-blocks'),
	},
	lineVertical: {
		type: 'string',
		default: 'center',
	},
	lineHorizontal: {
		type: 'string',
		default: 'center',
	},
	lineOrientation: {
		type: 'string',
		default: 'horizontal',
	},
	linesAlign: {
		type: 'string',
		default: 'row',
	},
	divider: {
		type: 'object',
		default: attributesData.divider,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'object',
		default: size,
	},
	opacity: {
		type: 'object',
		default: attributesData.opacity,
	},
	background: {
		type: 'object',
		default: attributesData.background,
	},
	backgroundHover: {
		type: 'object',
		default: attributesData.backgroundHover,
	},
	boxShadow: {
		type: 'object',
		default: attributesData.boxShadow,
	},
	boxShadowHover: {
		type: 'object',
		default: attributesData.boxShadowHover,
	},
	padding: {
		type: 'object',
		default: attributesData.padding,
	},
	margin: {
		type: 'object',
		default: attributesData.margin,
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
	highlight: {
		type: 'object',
		default: attributesData.highlight,
	},
};

export default attributes;
