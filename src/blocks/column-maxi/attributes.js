/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Attributes
 */
const attributes = {
	columnSize: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalColumn),
	},
	verticalAlign: {
		type: 'string',
		default: 'stretch',
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
	fullWidth: {
		type: 'string',
		default: 'normal',
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
	extraClassName: {
		type: 'string',
		default: '',
	},
	extraStyles: {
		type: 'string',
		default: '',
	},
	zIndex: {
		type: 'number',
	},
	display: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalDisplay),
	},
	transform: {
		type: 'string',
		default: JSON.stringify(attributesData.__experimentalTransform),
	},
};

export default attributes;
