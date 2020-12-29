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
		default: __('Container', 'maxi-blocks'),
	},
	sizeContainer: {
		type: 'object',
		default: attributesData.container,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'object',
		default: attributesData.size,
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
		default: attributesData.paddingContainer,
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
	arrow: {
		type: 'object',
		default: attributesData.arrow,
	},
	transform: {
		type: 'object',
		default: attributesData.transform,
	},
};

export default attributes;
