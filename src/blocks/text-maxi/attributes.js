/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { margin } from './data';

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
        default: 'left'
    },
    alignmentTablet: {
        type: 'string',
        default: 'left'
    },
    alignmentMobile: {
        type: 'string',
        default: 'left'
    },
    textLevel: {
        type: 'string',
        default: 'p'
    },
    typography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    opacity: {
        type: 'number',
        default: 100
    },
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
    },
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    opacityHover: {
        type: 'number',
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
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
    content: {
        type: 'string',
        default: ''
    }
}

export default attributes;
