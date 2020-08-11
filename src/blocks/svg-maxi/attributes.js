/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { size } from './data';

/**
 * Attributes
 */
const attributes = {
    SVGElement: {
        type: 'string'
    },
    SVGData: {
        type: 'string',
        // default: '{}'
    },
    SVGMediaID: {
        type: 'number',
    },
    SVGMediaURL: {
        type: 'string'
    },
    alignment: {
        type: 'string',
        default: JSON.stringify(attributesData.alignment)
    },
    fullWidth: {
        type: 'string',
        default: 'normal',
    },
    size: {
        type: 'string',
        default: JSON.stringify(size)
    },
    opacity: {
        type: 'string',
        default: JSON.stringify(attributesData.opacity)
    },
    opacityHover: {
        type: 'string',
        default: JSON.stringify(attributesData.opacityHover)
    },
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
    position: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalPosition)
    },
    display: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalDisplay)
    },
    clipPath: {
        type: 'string',
        default: ''
    },
    motion: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalMotion)
    },
    transform: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalTransform)
    }
}

export default attributes;
