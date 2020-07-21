/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';

/**
 * Attributes
 */
const attributes = {
    sizeContainer: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalContainer)
    },
    fullWidth: {
        type: 'string',
        default: 'full',
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
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
    hoverPadding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    hoverAnimation: {
        type: 'string',
        default: 'none',
    },
    hoverAnimationType: {
        type: 'string',
        default: 'tilt',
    },
    hoverAnimationTypeText: {
        type: 'string',
        default: 'fade',
    },
    hoverAnimationDuration: {
        type: 'string',
        default: 'normal',
    },
    hoverCustomTextContent: {
        type: 'string',
        default: 'no'
    },
    hoverCustomTextTitle: {
        type: 'string',
        default: 'no'
    },
    hoverAnimationTitle: {
        type: 'string',
        default: 'Add your Hover Title here',
    },
    hoverAnimationContent: {
        type: 'string',
        default: 'Add your Hover Content here',
    },
    hoverAnimationCustomBorder: {
        type: 'string',
        default: 'no'
    },
    hoverAnimationTitleTypography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    hoverAnimationContentTypography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    hoverCustomTextContent: {
        type: 'string',
        default: 'no'
    },
    hoverCustomTextTitle: {
        type: 'string',
        default: 'no'
    },
    hoverOpacity: {
        type: 'string',
        default: JSON.stringify(attributesData.opacityHover)
    },
    hoverBorder: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    hoverBackground: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    hoverAnimationTypeOpacity: {
        type: 'number',
    },
    hoverAnimationTypeOpacityColor: {
        type: 'number',
    },
    hoverAnimationTypeOpacityColorBackground: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    shapeDivider: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalShapeDivider)
    },
    position: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalPosition)
    },
    display: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalDisplay)
    },
    display: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalDisplay)
    },
    motion: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalMotion)
    },
}

export default attributes;