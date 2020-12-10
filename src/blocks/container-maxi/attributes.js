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
		type: 'string',
		default: JSON.stringify(attributesData.container),
	},
	fullWidth: {
		type: 'string',
		default: 'full',
	},
	size: {
		type: 'string',
		default: JSON.stringify(attributesData.size),
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
	overlay: {
		type: 'string',
		default: JSON.stringify(attributesData.overlay),
	},
	overlayHover: {
		type: 'string',
		default: JSON.stringify(attributesData.overlayHover),
	},
	border: {
		type: 'string',
		default: JSON.stringify(attributesData.border),
	},
	borderHover: {
		type: 'string',
		default: JSON.stringify(attributesData.borderHover),
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
		default: JSON.stringify(attributesData.padding),
	},
	shapeDivider: {
		type: 'string',
		default: JSON.stringify(attributesData.shapeDivider),
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
	arrow: {
		type: 'string',
		default: JSON.stringify(attributesData.arrow),
	},
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.transform),
	},
};

export default attributes;
