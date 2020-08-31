/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { size } from './data';

/**
 * Attributes
 */
const attributes = {
    imageSize: {
        type: 'string',
        default: 'full'
    },
    alignment: {
        type: 'string',
        default: JSON.stringify(attributesData.alignment)
    },
    content: {
        type: 'string',
        default: ''
    },
    hoverContent: {
        type: 'string',
        default: ''
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
    svgColorOrange: {
        type: 'string',
        default: '#FF4A17'
    },
    svgColorBlack: {
        type: 'string',
        default: '#081219'
    },
    svgColorWhite: {
        type: 'string',
        default: '#FFF'
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
    motion: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalMotion)
    },
    hover: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalHover)
    },
    transform: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalTransform)
    },
    scale: {
        type: 'number',
        default: 1.0,
    },
    stroke: {
        type: 'number',
        default: 2.0,
    },
    defaultStroke: {
        type: 'number',
        default: 2.0,
    },
    animation: {
        type: 'string',
        default: 'loop',
    },
    duration: {
        type: 'number',
        default: 3.7,
    },
    size: {
        type: 'string',
        default: JSON.stringify(size)
    },
    width: {
        type: 'number',
        default: 64
    }
}

export default attributes;