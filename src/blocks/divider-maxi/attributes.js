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
		type: 'string',
		default: JSON.stringify(attributesData.Divider),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'string',
		default: JSON.stringify(size),
	},
	opacity: {
		type: 'number',
		default: JSON.stringify(attributesData.opacity),
	},
	background: {
		type: 'string',
		default: JSON.stringify(attributesData.background),
	},
	backgroundHover: {
		type: 'string',
		default: JSON.stringify(attributesData.backgroundHover),
	},
	boxShadow: {
		type: 'string',
		default: JSON.stringify(attributesData.boxShadow),
	},
	boxShadowHover: {
		type: 'string',
		default: JSON.stringify(attributesData.boxShadowHover),
	},
	padding: {
		type: 'string',
		default: JSON.stringify(attributesData.padding),
	},
	margin: {
		type: 'string',
		default: JSON.stringify(attributesData.margin),
	},
	position: {
		type: 'string',
		default: JSON.stringify(attributesData.Position),
	},
	display: {
		type: 'string',
		default: JSON.stringify(attributesData.Display),
	},
	motion: {
		type: 'string',
		default: JSON.stringify(attributesData.Motion),
	},
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.Transform),
	},
};

export default attributes;
