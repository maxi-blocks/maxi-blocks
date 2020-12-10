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
		type: 'object',
		default: attributesData.alignment,
	},
	alignmentText: {
		type: 'object',
		default: buttonAttributesData.alignmentText,
	},
	typography: {
		type: 'object',
		default: buttonAttributesData.typography,
	},
	typographyHover: {
		type: 'object',
		default: attributesData.typographyHover,
	},
	background: {
		type: 'object',
		default: buttonAttributesData.background,
	},
	backgroundHover: {
		type: 'object',
		default: attributesData.backgroundHover,
	},
	opacity: {
		type: 'object',
		default: attributesData.opacity,
	},
	border: {
		type: 'object',
		default: buttonAttributesData.border,
	},
	borderHover: {
		type: 'object',
		default: attributesData.borderHover,
	},
	size: {
		type: 'object',
		default: attributesData.size,
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
		default: buttonAttributesData.padding,
	},
	iconPadding: {
		type: 'object',
		default: attributesData.padding,
	},
	iconBorder: {
		type: 'object',
		default: attributesData.border,
	},
	iconBackground: {
		type: 'object',
		default: attributesData.background,
	},
	content: {
		type: 'string',
		default: '',
	},
	position: {
		type: 'object',
		default: attributesData.__experimentalPosition,
	},
	display: {
		type: 'object',
		default: attributesData.__experimentalDisplay,
	},
	motion: {
		type: 'object',
		default: attributesData.__experimentalMotion,
	},
	transform: {
		type: 'object',
		default: attributesData.__experimentalTransform,
	},
	icon: {
		type: 'object',
		default: buttonAttributesData.icon,
	},
};

export default attributes;
