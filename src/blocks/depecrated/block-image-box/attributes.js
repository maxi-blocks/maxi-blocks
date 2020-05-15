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
    imagePosition: {
        type: 'string',
        default: 'top',
    },
    titleLevel: {
        type: 'string',
        default: 'h2'
    },
    linkTitle: {
        type: 'string',
    },
    linkOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.linkOptions),
    },
    titleFontOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.titleFontOptions),
    },
    subtitleFontOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.subtitleFontOptions),
    },
    descriptionFontOptions: {
        type: 'string',
        default: JSON.stringify(attributesData.descriptionFontOptions),
    },
    imageSettings: {
        type: 'string',
        default: JSON.stringify(attributesData.imageSettings)
    },
    buttonSettings: {
        type: 'string',
        default: JSON.stringify(attributesData.buttonSettings)
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
    mediaID: {
        type: 'number',
    },
    title: {
        type: 'array',
        source: 'children',
        selector: '.maxi-image-box-title',
    },
    additionalText: {
        type: 'array',
        source: 'children',
        selector: '.maxi-image-box-subtitle',
    },
    description: {
        source: 'children',
        selector: '.maxi-image-box-description',
    },
}

export default attributes;
