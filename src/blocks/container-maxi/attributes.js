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
    containerXl: {
        type: 'number',
        default: 1200,
    },
    maxWidthXl: {
        type: 'number',
        default: 1140,
    },
    containerLg: {
        type: 'number',
        default: 992
    },
    maxWidthLg: {
        type: 'number',
        default: 960
    },
    containerMd: {
        type: 'number',
        default: 768
    },
    maxWidthMd: {
        type: 'number',
        default: 720
    },
    containerSm: {
        type: 'number',
        default: 576
    },
    maxWidthSm: {
        type: 'number',
        default: 540
    },
    containerPadding: {
        type: 'number',
        default: 16
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
        default: JSON.stringify(attributesData.shapeDivider)
    },
}

export default attributes;