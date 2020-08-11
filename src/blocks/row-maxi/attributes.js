/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Attributes
 */
const attributes = {
    rowPattern: {
        type: 'number',
    },
    horizontalAlign: {
        type: 'string',
        default: 'space-between'
    },
    verticalAlign: {
        type: 'string',
        default: 'stretch'
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
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
    },
    fullWidth: {
        type: 'string',
        default: 'normal',
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    position: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalPosition)
    },
    display: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalDisplay)
    },
    transform: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalTransform)
    }
}

export default attributes;