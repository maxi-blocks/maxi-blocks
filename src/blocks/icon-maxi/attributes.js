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
    icon: {
        type: 'string',
        default: 'android'
    },
    size: {
        type: 'string',
        default: 'full'
    },
    sizeOptions: {
        type: 'string',
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
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
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
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
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
        default: JSON.stringify(attributesData.border)
    },
    extraClassName: {
        type: 'string',
        default: ''
    },
    extraStyles: {
        type: 'string',
        default: ''
    },
    resizableWidth: {
        type: 'number',
        default: 100
    },
    resizableHeight: {
        type: 'number',
        default: 100
    },
    position: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalPosition)
    }
}

export default attributes;
