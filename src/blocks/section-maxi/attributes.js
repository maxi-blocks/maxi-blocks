/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import * as sectionAttributesData from './data';

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
    fullWidth: {
        type: 'string',
        default: 'normal',
    },
    size: {
        type: 'string',
        default: JSON.stringify(sectionAttributesData.size)
    },
    opacity: {
        type: 'number',
        default: 1
    },
    opacityHover: {
        type: 'number',
    },
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
    },
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
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
        default: JSON.stringify(sectionAttributesData.margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(sectionAttributesData.padding)
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
    zIndex: {
        type: 'number'
    }
}

export default attributes;