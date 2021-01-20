/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import rowPattern from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Row', 'maxi-blocks'),
	},
	rowPattern: {
		type: 'object',
		default: rowPattern,
	},
	horizontalAlign: {
		type: 'string',
		default: 'space-between',
	},
	verticalAlign: {
		type: 'string',
		default: 'stretch',
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
	border: {
		type: 'object',
		default: attributesData.border,
	},
	borderHover: {
		type: 'object',
		default: attributesData.borderHover,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'object',
		default: attributesData.size,
	},
	sizeContainer: {
		type: 'object',
		default: attributesData.row,
	},
	boxShadow: {
		type: 'object',
		default: attributesData.boxShadow,
	},
	boxShadowHover: {
		type: 'object',
		default: attributesData.boxShadowHover,
	},
	margin: {
		type: 'object',
		default: attributesData.margin,
	},
	padding: {
		type: 'object',
		default: attributesData.padding,
	},
	position: {
		type: 'object',
		default: attributesData.position,
	},
	display: {
		type: 'object',
		default: attributesData.display,
	},
	transform: {
		type: 'object',
		default: attributesData.transform,
	},
};

export default attributes;
