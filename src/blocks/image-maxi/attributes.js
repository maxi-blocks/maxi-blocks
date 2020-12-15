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
		default: __('Image', 'maxi-blocks'),
	},
	SVGCurrentElement: {
		type: 'number',
	},
	SVGElement: {
		type: 'string',
	},
	SVGData: {
		type: 'string',
		default: '{}',
	},
	SVGMediaID: {
		type: 'number',
	},
	SVGMediaURL: {
		type: 'string',
	},
	imageSize: {
		type: 'string',
		default: 'full',
	},
	cropOptions: {
		type: 'string',
		default: JSON.stringify(attributesData.cropOptions),
	},
	alignment: {
		type: 'string',
		default: JSON.stringify(attributesData.alignment),
	},
	captionType: {
		type: 'string',
		default: 'none',
	},
	captionContent: {
		type: 'string',
		default: '',
	},
	captionTypography: {
		type: 'string',
		default: JSON.stringify(attributesData.typography),
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
		type: 'string',
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
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
	},
	mediaAlt: {
		type: 'string',
	},
	mediaAltWp: {
		type: 'string',
	},
	mediaAltTitle: {
		type: 'string',
	},
	altSelector: {
		type: 'string',
		default: 'wordpress',
	},
	mediaWidth: {
		type: 'number',
	},
	mediaHeight: {
		type: 'number',
	},
	position: {
		type: 'string',
		default: JSON.stringify(attributesData.position),
	},
	display: {
		type: 'string',
		default: JSON.stringify(attributesData.display),
	},
	clipPath: {
		type: 'string',
		default: '',
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
};

export default attributes;
