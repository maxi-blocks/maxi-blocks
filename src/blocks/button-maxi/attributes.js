/**
 * Imports
 */
import * as attributesData from './data';

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
    // Is this necessary? vvv
    buttonSettings: {
        type: 'string',
        default: JSON.stringify(attributesData.buttonSettings)
    },
    alignment: {
        type: 'string',
        default: 'center'
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
    },
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    typography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    opacity: {
        type: 'number',
        default: 100
    },
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
    },
    marginHover: {
        type: 'string',
        default: JSON.stringify(attributesData.marginHover)
    },
    paddingHover: {
        type: 'string',
        default: JSON.stringify(attributesData.paddingHover)
    },
    opacityHover: {
        type: 'number',
        default: 100
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
    }
}

export default attributes;
