/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as buttonAttributesData from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Button', 'maxi-blocks'),
	},
	alignment: {
		type: 'string',
		default: JSON.stringify(attributesData.alignment),
	},
	alignmentText: {
		type: 'string',
		default: JSON.stringify(buttonAttributesData.alignmentText),
	},
	typography: {
		type: 'string',
		default: JSON.stringify(buttonAttributesData.typography),
	},
	typographyHover: {
		type: 'string',
		default: JSON.stringify(attributesData.typographyHover),
	},
	background: {
		type: 'string',
		default: JSON.stringify(buttonAttributesData.background),
	},
	backgroundHover: {
		type: 'string',
		default: JSON.stringify(attributesData.backgroundHover),
	},
	opacity: {
		type: 'number',
		default: JSON.stringify(attributesData.opacity),
	},
	border: {
		type: 'string',
		default: JSON.stringify(buttonAttributesData.border),
	},
	borderHover: {
		type: 'string',
		default: JSON.stringify(attributesData.borderHover),
	},
	size: {
		type: 'string',
		default: JSON.stringify(attributesData.size),
	},
	boxShadow: {
		type: 'string',
		default: JSON.stringify(attributesData.boxShadow),
	},
	boxShadowHover: {
		type: 'string',
		default: JSON.stringify(attributesData.boxShadowHover),
	},
	margin: {
		type: 'string',
		default: JSON.stringify(attributesData.margin),
	},
	padding: {
		type: 'string',
		default: JSON.stringify(buttonAttributesData.padding),
	},
	iconPadding: {
		type: 'string',
		default: JSON.stringify(attributesData.padding),
	},
	iconBorder: {
		type: 'string',
		default: JSON.stringify(attributesData.border),
	},
	iconBackground: {
		type: 'string',
		default: JSON.stringify(attributesData.background),
	},
	content: {
		type: 'string',
		default: '',
	},
	position: {
		type: 'string',
		default: JSON.stringify(attributesData.position),
	},
	display: {
		type: 'string',
		default: JSON.stringify(attributesData.display),
	},
	motion: {
		type: 'string',
		default: JSON.stringify(attributesData.motion),
	},
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.transform),
	},
	icon: {
		type: 'string',
		default: JSON.stringify(buttonAttributesData.icon),
	},
	highlight: {
		type: 'string',
		default: JSON.stringify(attributesData.highlight),
	},
};

export default attributes;
