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
    hideDivider: {
        type: 'boolean',
        default: false
    },
    verticalDivider: {
        type: 'boolean',
        default: false
    },
    roundedDivider: {
        type: 'boolean',
        default: false
    },
    alignment: {
        type: 'string',
        default: 'center'
    },
    dividerWidthUnit: {
        type: 'string',
        default: '%'
    },
    dividerWidth: {
        type: 'number',
        default: 20
    },
    dividerHeightUnit: {
        type: 'string',
        default: 'px'
    },
    dividerHeight: {
        type: 'number',
        default: 5
    },
    dividerColor: {
        type: 'string',
        default: '#00ccff'
    },
    dividerColorDefault: {
        type: 'string',
        default: '#00ccff'
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    opacity: {
        type: 'number',
        default: 1
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
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
}

export default attributes;
