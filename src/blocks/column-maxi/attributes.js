/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Column', 'maxi-blocks'),
	},
	columnSize: {
		type: 'object',
		default: attributesData.column,
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
	extraClassName: {
		type: 'string',
		default: '',
	},
	extraStyles: {
		type: 'string',
		default: '',
	},
	zIndex: {
		type: 'number',
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
