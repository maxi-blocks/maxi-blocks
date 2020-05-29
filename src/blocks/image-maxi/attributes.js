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
    alignment: {
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
    },
    backgroundColor: {
        type: 'string',
        default: '',
    },
    backgroundDefaultColor: {
        type: 'string',
        default: '',
    },
    backgroundGradient: {
        type: 'string',
        default: '',
    },
    backgroundGradientDefault: {
        type: 'string',
        default: '',
    },
    opacity: {
        type: 'number',
        default: 1
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
    backgroundColorHover: {
        type: 'string',
        default: '',
    },
    backgroundDefaultColorHover: {
        type: 'string',
        default: '',
    },
    backgroundGradientHover: {
        type: 'string',
        default: '',
    },
    backgroundtDefaultGradienHover: {
        type: 'string',
        default: '',
    },
    backgroundGradientAboveBackgroundHover: {
        type: 'boolean',
        default: false
    },
    opacityHover: {
        type: 'number',
        default: 1
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
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
    }
}

export default attributes;
