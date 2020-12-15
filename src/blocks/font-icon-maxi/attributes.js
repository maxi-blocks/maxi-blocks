/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { icon, alignmentIcon } from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Font Icon', 'maxi-blocks'),
	},
	icon: {
		type: 'string',
		default: JSON.stringify(icon),
	},
	alignment: {
		type: 'string',
		default: JSON.stringify(alignmentIcon),
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
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.transform),
	},
};

export default attributes;
