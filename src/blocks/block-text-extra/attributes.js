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
        default: 'gx-custom'
    },
    defaultBlockStyle: {
        type: 'string',
        default: 'gx-def-light'
    },
    textLevel: {
        type: 'string',
        default: 'p'
    },
    typography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    backgroundColor: {
        type: 'string',
        default: '',
    },
    backgroundDefaultColor: {
        type: 'string',
        default: '',
    },
    backgroundGradient: {
        type: 'string',
        default: '',
    },
    backgroundGradientDefault: {
        type: 'string',
        default: '',
    },
    opacity: {
        type: 'number',
        default: 100
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
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
    },
    backgroundColorHover: {
        type: 'string',
        default: '',
    },
    backgroundDefaultColorHover: {
        type: 'string',
        default: '',
    },
    backgroundGradientHover: {
        type: 'string',
        default: '',
    },
    backgroundGradientDefaultHover: {
        type: 'string',
        default: '',
    },
    opacityHover: {
        type: 'number',
        default: 100
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    borderHover: {
        type: 'string',
        default: JSON.stringify(attributesData.borderHover)
    },
    marginHover: {
        type: 'string',
        default: JSON.stringify(attributesData.marginHover)
    },
    paddingHover: {
        type: 'string',
        default: JSON.stringify(attributesData.paddingHover)
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
    }
}

export default attributes;
