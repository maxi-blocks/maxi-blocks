/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as buttonAttributesData from './data';

/**
 * Attributes
 */
const attributes = {
	alignment: JSON.stringify(attributesData.alignment),

	alignmentText: JSON.stringify(buttonAttributesData.alignmentText),

	typography: JSON.stringify(buttonAttributesData.typography),

	typographyHover: JSON.stringify(attributesData.typographyHover),

	background: JSON.stringify(buttonAttributesData.background),

	backgroundHover: JSON.stringify(attributesData.backgroundHover),

	opacity: JSON.stringify(attributesData.opacity),

	border: JSON.stringify(buttonAttributesData.border),

	borderHover: JSON.stringify(attributesData.borderHover),

	size: JSON.stringify(attributesData.size),

	boxShadow: JSON.stringify(attributesData.boxShadow),

	boxShadowHover: JSON.stringify(attributesData.boxShadowHover),

	margin: JSON.stringify(attributesData.margin),

	padding: JSON.stringify(buttonAttributesData.padding),

	iconPadding: JSON.stringify(attributesData.padding),

	iconBorder: JSON.stringify(attributesData.border),

	iconBackground: JSON.stringify(attributesData.background),

	position: JSON.stringify(attributesData.__experimentalPosition),

	display: JSON.stringify(attributesData.__experimentalDisplay),

	motion: JSON.stringify(attributesData.__experimentalMotion),

	transform: JSON.stringify(attributesData.__experimentalTransform),

	icon: JSON.stringify(buttonAttributesData.icon),
};

export default attributes;
