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
    size: {
        type: 'string',
        default: 'full'
    },
    sizeOptions: {
        type: 'string',
    },
    cropOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.cropOptions)
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
    },
    alignmentMobile: {
        type: 'string',
    },
    captionType: {
        type: 'string',
        default: 'none'
    },
    captionContent: {
        type: 'string',
        default: ''
    },
    captionTypography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
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
    opacity: {
        type: 'number',
        default: 1
    },
    opacityHover: {
        type: 'number',
    },
    hoverOpacity: {
        type: 'number',
    },
    hoverAnimationTypeOpacity: {
        type: 'number',
    },
    hoverAnimationTypeOpacityColor: {
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
    hoverBackground: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    hoverAnimationTypeOpacityColorBackground: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
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
    hoverBorder: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    hoverPadding: {
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
    hoverAnimationType: {
        type: 'string',
        default: 'tilt',
    },
    hoverAnimationTypeText: {
        type: 'string',
        default: 'fade',
    },
    extraClassName: {
        type: 'string',
        default: ''
    },
    extraStyles: {
        type: 'string',
        default: ''
    },
    mediaID: {
        type: 'number',
    },
    mediaURL: {
        type: 'string'
    },
    mediaALT: {
        type: 'string'
    },
    mediaURL: {
        type: 'string'
    },
    mediaWidth: {
        type: 'number'
    },
    mediaHeight: {
        type: 'number'
    },
    zIndex: {
        type: 'number'
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
    hoverAnimationTypeColor: {
        type: 'string',
        default: '#000'
    }

}

export default attributes;
