/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { alignment } from './data';

/**
 * Attributes
 */
const attributes = {
	customLabel: {
		type: 'string',
		default: __('Text', 'maxi-blocks'),
	},
	alignment: {
		type: 'object',
		default: alignment,
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
		type: 'object',
		default: attributesData.typography,
	},
	typographyHover: {
		type: 'object',
		default: attributesData.typographyHover,
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
	fullWidth: {
		type: 'string',
		default: 'normal',
	},
	size: {
		type: 'object',
		default: attributesData.size,
	},
	margin: {
		type: 'object',
		default: attributesData.margin,
	},
	padding: {
		type: 'object',
		default: attributesData.padding,
	},
	hoverPadding: {
		type: 'object',
		default: attributesData.padding,
	},
	content: {
		type: 'string',
		default: '',
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
	transform: {
		type: 'object',
		default: attributesData.transform,
	},
	highlight: {
		type: 'object',
		default: attributesData.highlight,
	},
};

export default attributes;
