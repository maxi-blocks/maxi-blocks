/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as buttonAttributesData from './data';

/**
 * Attributes
 */
const attributes = {
    blockStyle: {
        type: 'string',
        default: 'maxi-custom'
    },
    defaultBlockStyle: {
        type: 'string',
        default: 'maxi-def-light'
    },
    alignmentDesktop: {
        type: 'string',
        default: 'center'
    },
    alignmentTablet: {
        type: 'string',
        default: 'center'
    },
    alignmentMobile: {
        type: 'string',
        default: 'center'
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
        default: 100
    },
    opacityHover: {
        type: 'number',
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
    hoverAnimation: {
        type: 'string',
        default: 'none',
    },
    hoverAnimationDuration: {
        type: 'string',
        default: 'normal',
    },
    extraClassName: {
        type: 'string',
        default: ''
    },
    extraStyles: {
        type: 'string',
        default: ''
    },
    buttonText: {
        type: 'string',
        default: ''
    },
    linkOptions: {
        type: 'string',
        default: '{}'
    },
    zIndex: {
        type: 'number'
    }
}

export default attributes;
