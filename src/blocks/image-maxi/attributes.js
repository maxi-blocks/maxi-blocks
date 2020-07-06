/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Attributes
 */
const attributes = {
    size: {
        type: 'string',
        default: 'full'
    },
    sizeOptions: {
        type: 'string',
    },
    cropOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.cropOptions)
    },
    fullWidth: {
        type: 'string',
        default: 'normal',
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
    maxWidthUnit: {
        type: 'string',
        default: 'px'
    },
    maxWidth: {
        type: 'number',
    },
    widthUnit: {
        type: 'string',
        default: 'px'
    },
    width: {
        type: 'number',
        default: 100
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
    mediaURL: {
        type: 'string'
    },
    mediaWidth: {
        type: 'number'
    },
    mediaHeight: {
        type: 'number'
    },
}

export default attributes;
