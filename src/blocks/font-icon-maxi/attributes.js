/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import icon from './data';

/**
 * Attributes
 */
const attributes = {
	icon: {
		type: 'string',
		default: JSON.stringify(icon),
	},

	alignment: {
		type: 'string',
		default: JSON.stringify(attributesData.alignment),
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
