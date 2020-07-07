/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { margin } from './data';

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
    alignmentDesktop: {
        type: 'string',
        default: 'left'
    },
    alignmentTablet: {
        type: 'string',
    },
    alignmentMobile: {
        type: 'string',
    },
    textLevel: {
        type: 'string',
        default: 'p'
    },
    typography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    opacity: {
        type: 'number',
        default: 100
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
    fullWidth: {
        type: 'string',
        default: 'normal',
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    hoverPadding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
    },
    backgroundHover: {
        type: 'string',
        default: JSON.stringify(attributesData.backgroundHover)
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
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
        default: JSON.stringify(attributesData.borderHover)
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
    content: {
        type: 'string',
        default: ''
    },
    zIndex: {
        type: 'number'
    },
    hoverAnimationType: {
      type: 'string',
      default: 'tilt',
    },
    hoverAnimationTypeText: {
      type: 'string',
      default: 'fade',
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
}


export default attributes;
