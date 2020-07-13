/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { size } from './data';

/**
 * Attributes
 */
const attributes = {
    showLine: {
        type: 'number',
        default: 1
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
    divider: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalDivider)
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
        type: 'number',
        default: JSON.stringify(attributesData.opacity)
    },
    opacityHover: {
        type: 'number',
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
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
}

export default attributes;
