/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as buttonAttributesData from './data';

/**
 * Attributes
 */
const attributes = {
    alignment: {
        type: 'string',
        default: JSON.stringify(attributesData.alignment)
    },
    typography: {
        type: 'string',
        default: JSON.stringify(buttonAttributesData.typography)
    },
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
    },
    background: {
        type: 'string',
        default: JSON.stringify(buttonAttributesData.background)
    },
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
    },
    opacity: {
        type: 'number',
        default: JSON.stringify(attributesData.opacity)
    },
    opacityHover: {
        type: 'number',
        default: JSON.stringify(attributesData.opacityHover)
    },
    border: {
        type: 'string',
        default: JSON.stringify(buttonAttributesData.border)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(buttonAttributesData.padding)
    },
    buttonText: {
        type: 'string',
        default: ''
    },
}

export default attributes;
