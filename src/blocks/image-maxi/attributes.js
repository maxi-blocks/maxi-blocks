/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

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
    zIndex: {
        type: 'number'
    }
}

export default attributes;
