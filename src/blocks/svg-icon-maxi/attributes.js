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
		type: 'string',
		default: JSON.stringify(attributesData.alignment),
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
		type: 'string',
		default: JSON.stringify(attributesData.opacity),
	},
	background: {
		type: 'string',
		default: JSON.stringify(attributesData.background),
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
	border: {
		type: 'string',
		default: JSON.stringify(attributesData.border),
	},
	borderHover: {
		type: 'string',
		default: JSON.stringify(attributesData.borderHover),
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
	hover: {
		type: 'string',
		default: JSON.stringify(attributesData.hover),
	},
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.transform),
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
};

export default attributes;
