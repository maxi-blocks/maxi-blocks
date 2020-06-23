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
    showLine: {
        type: 'string',
        default: 'yes'
    },
    lineVertical: {
        type: 'string',
        default: 'center'
    },
    lineHorizontal: {
        type: 'string',
        default: 'center'
    },
    lineOrientation: {
        type: 'string',
        default: 'horizontal'
    },
    linesAlign: {
        type: 'string',
        default: 'row'
    },
    divider1: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalDivider1)
    },
    fullWidth: {
        type: 'string',
        default: 'normal',
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
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
    zIndex: {
        type: 'number'
    }
}

export default attributes;
