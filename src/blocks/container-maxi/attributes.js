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
		default: attributesData.__experimentalContainer,
	},
	fullWidth: {
		type: 'string',
		default: 'full',
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
	overlay: {
		type: 'object',
		default: attributesData.overlay,
	},
	overlayHover: {
		type: 'object',
		default: attributesData.overlayHover,
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
		default: attributesData.padding,
	},
	shapeDivider: {
		type: 'object',
		default: attributesData.__experimentalShapeDivider,
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
	arrow: {
		type: 'object',
		default: attributesData.__experimentalArrow,
	},
	transform: {
		type: 'object',
		default: attributesData.__experimentalTransform,
	},
};

export default attributes;
