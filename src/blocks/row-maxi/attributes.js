/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Attributes
 */
const attributes = {
    rowPattern: {
        type: 'string',
    },
    blockStyle: {
        type: 'string',
        default: 'maxi-custom'
    },
    defaultBlockStyle: {
        type: 'string',
        default: 'maxi-def-light'
    },
    columnGap: {
        type: 'number',
        default: 0
    },
    syncSize: {
        type: 'boolean',
        default: true,
    },
    syncStyles: {
        type: 'boolean',
        default: true,
    },
    horizontalAlign: {
        type: 'string',
        default: 'flex-start'
    },
    verticalAlign: {
        type: 'string',
        default: 'stretch'
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
        default: JSON.stringify(attributesData.margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
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
}

export default attributes;