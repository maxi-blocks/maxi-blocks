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
    imageSize: {
        type: 'string',
        default: 'full'
    },
    cropOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.cropOptions)
    },
    alignment: {
        type: 'string',
        default: JSON.stringify(attributesData.alignment)
    },
    captionType: {
        type: 'string',
        default: 'none'
    },
    captionContent: {
        type: 'string',
        default: ''
    },
    captionTypography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
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
    mediaID: {
        type: 'number',
    },
    mediaURL: {
        type: 'string'
    },
    mediaALT: {
        type: 'string'
    },
    mediaALTwp: {
        type: 'string'
    },
    mediaALTtitle: {
        type: 'string'
    },
    altSelector: {
        type: 'string',
        default: 'wordpress',

    },
    mediaURL: {
        type: 'string'
    },
    mediaWidth: {
        type: 'number'
    },
    mediaHeight: {
        type: 'number'
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
    hover: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalHover)
    },
    transform: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalTransform)
    }
}

export default attributes;
