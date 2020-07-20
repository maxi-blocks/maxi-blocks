/**
 * Imports
 */
import * as attributesData from '../../extensions/styles/defaults';
import { alignment, margin } from './data';

/**
 * Attributes
 */
const attributes = {
    alignment: {
        type: 'string',
        default: JSON.stringify(alignment)
    },
    textLevel: {
        type: 'string',
        default: 'p'
    },
    isList: {
        type: 'boolean',
        default: false
    },
    typeOfList: {
        type: 'string',
        default: 'ul'
    },
    listStart: {
        type: 'number',
        default: 1
    },
    listReversed: {
        type: 'number',
        default: 0
    },
    typography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
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
    content: {
        type: 'string',
        default: ''
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
    position: {
        type: 'string',
        default: JSON.stringify(attributesData.__experimentalPosition)
    }
}


export default attributes;
