/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { alignment, margin } from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Text', 'maxi-blocks'),
	},
	alignment: {
		type: 'string',
		default: JSON.stringify(alignment),
	},
	textLevel: {
		type: 'string',
		default: 'p',
	},
	isList: {
		type: 'boolean',
		default: false,
	},
	typeOfList: {
		type: 'string',
		default: 'ul',
	},
	listStart: {
		type: 'number',
		default: 1,
	},
	listReversed: {
		type: 'number',
		default: 0,
	},
	typography: {
		type: 'string',
		default: JSON.stringify(attributesData.typography),
	},
	typographyHover: {
		type: 'string',
		default: JSON.stringify(attributesData.typographyHover),
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
	border: {
		type: 'string',
		default: JSON.stringify(attributesData.border),
	},
	borderHover: {
		type: 'string',
		default: JSON.stringify(attributesData.borderHover),
	},
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'string',
		default: JSON.stringify(attributesData.size),
	},
	margin: {
		type: 'string',
		default: JSON.stringify(margin),
	},
	padding: {
		type: 'string',
		default: JSON.stringify(attributesData.padding),
	},
	hoverPadding: {
		type: 'string',
		default: JSON.stringify(attributesData.padding),
	},
	content: {
		type: 'string',
		default: '',
	},
	position: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalPosition),
	},
	display: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalDisplay),
	},
	motion: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalMotion),
	},
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalTransform),
	},
};

export default attributes;
