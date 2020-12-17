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
		type: 'object',
		default: icon,
	},
	alignment: {
		type: 'object',
		default: alignmentIcon,
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
		default: y(attributesData.position),
	},
	display: {
		type: 'object',
		default: y(attributesData.display),
	},
	motion: {
		type: 'object',
		default: y(attributesData.motion),
	},
	transform: {
		type: 'object',
		default: y(attributesData.transform),
	},
	highlight: {
		type: 'object',
		default: y(attributesData.highlight),
	},
};

export default attributes;
