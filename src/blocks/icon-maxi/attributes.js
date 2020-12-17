/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { size } from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Icon', 'maxi-blocks'),
	},
	imageSize: {
		type: 'string',
		default: 'full',
	},
	cropOptions: {
		type: 'object',
		default: attributesData.cropOptions,
	},
	alignment: {
		type: 'object',
		default: attributesData.alignment,
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
		type: 'object',
		default: attributesData.typography,
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'object',
		default: size,
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
		type: 'object',
		default: attributesData.position,
	},
	display: {
		type: 'object',
		default: attributesData.display,
	},
	clipPath: {
		type: 'string',
		default: '',
	},
	hover: {
		type: 'object',
		default: attributesData.hover,
	},
	transform: {
		type: 'object',
		default: attributesData.transform,
	},
	content: {
		type: 'string',
		default: '',
	},
};

export default attributes;
