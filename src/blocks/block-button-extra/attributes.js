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
        default: 'gx-global'
    },
    defaultBlockStyle: {
        type: 'string',
        default: 'gx-def-light'
    },
    buttonSettings: {
        type: 'string',
        default: JSON.stringify(attributesData.buttonSettings)
    },
    alignment: {
        type: 'string',
        default: 'center'
    },
    size: {
        type: 'string',
        default: JSON.stringify(attributesData.size)
    },
    backgroundColor: {
        type: 'string',
        default: '#00ccff',
    },
    backgroundDefaultColor: {
        type: 'string',
        default: '#00ccff',
    },
    background: {
        type: 'string',
        default: '',
    },
    backgroundDefault: {
        type: 'string',
        default: '',
    },
    boxShadow: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadow)
    },
    typography: {
        type: 'string',
        default: JSON.stringify(attributesData.typography)
    },
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
    },
    margin: {
        type: 'string',
        default: JSON.stringify(attributesData.margin)
    },
    padding: {
        type: 'string',
        default: JSON.stringify(attributesData.padding)
    },
    opacity: {
        type: 'number',
        default: 100
    },
    backgroundColorHover: {
        type: 'string',
        default: '#00ccff',
    },
    backgroundDefaultColorHover: {
        type: 'string',
        default: '#00ccff',
    },
    backgroundHover: {
        type: 'string',
        default: '',
    },
    backgroundDefaultHover: {
        type: 'string',
        default: '',
    },
    boxShadowHover: {
        type: 'string',
        default: JSON.stringify(attributesData.boxShadowHover)
    },
    typographyHover: {
        type: 'string',
        default: JSON.stringify(attributesData.typographyHover)
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
    opacityHover: {
        type: 'number',
        default: 100
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
    buttonText: {
        type: 'string',
        default: ''
    },
    linkOptions: {
        type: 'string',
        default: '{}'
    }
}

export default attributes;
