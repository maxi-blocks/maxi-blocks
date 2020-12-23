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
		default: __('SVG Icon', 'maxi-blocks'),
	},
	alignment: {
		type: 'object',
		default: attributesData.alignment,
	},
	content: {
		type: 'string',
		default: '',
	},
	hoverContent: {
		type: 'string',
		default: '',
	},
	opacity: {
		type: 'object',
		default: attributesData.opacity,
	},
	background: {
		type: 'object',
		default: attributesData.background,
	},
	svgColorOrange: {
		type: 'string',
		default: '#FF4A17',
	},
	svgColorBlack: {
		type: 'string',
		default: '#081219',
	},
	svgColorWhite: {
		type: 'string',
		default: '#FFF',
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
	border: {
		type: 'object',
		default: attributesData.border,
	},
	borderHover: {
		type: 'object',
		default: attributesData.borderHover,
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
	hover: {
		type: 'object',
		default: attributesData.hover,
	},
	transform: {
		type: 'object',
		default: attributesData.transform,
	},
	scale: {
		type: 'number',
		default: 1.0,
	},
	stroke: {
		type: 'number',
		default: 2.0,
	},
	animation: {
		type: 'string',
		default: 'loop',
	},
	duration: {
		type: 'number',
		default: 3.7,
	},
	width: {
		type: 'number',
		default: 64,
	},
	highlight: {
		type: 'object',
		default: attributesData.highlight,
	},
};

export default attributes;
