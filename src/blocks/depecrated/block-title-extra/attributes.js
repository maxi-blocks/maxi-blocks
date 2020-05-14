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
    titleLevel: {
        type: "string",
        default: "h1",
    },
    subtitleLevel: {
        type: "string",
        default: "h3",
    },
    hideTitle: {
        type: 'boolean',
        default: false
    },
    hideSubtitle: {
        type: 'boolean',
        default: false
    },
    hideDescription: {
        type: 'boolean',
        default: false
    },
    twoColumnDescription: {
        type: 'boolean',
        default: false
    },
    contentDirection: {
        type: 'string',
        default: 'column'
    },
    titleFontOptions: {
        type: "string",
        default: JSON.stringify(attributesData.titleFontOptions)
    },
    subtitleFontOptions: {
        type: "string",
        default: JSON.stringify(attributesData.subtitleFontOptions)
    },
    descriptionFontOptions: {
        type: "string",
        default: JSON.stringify(attributesData.descriptionFontOptions)
    },
    subtitleBackgroundColor: {
        type: 'string',
        default: '#000000'
    },
    defaultSubtitleBackgroundColor: {
        type: 'string',
        default: '#000000'
    },
    divider: {
        type: 'string',
        default: JSON.stringify(attributesData.divider)
    },
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    boxShadow: {
        type: "string",
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
    padding: {
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
    extraClassName: {
        type: 'string',
        default: ''
    },
    extraStyles: {
        type: 'string',
        default: ''
    },
    subtitle: {
        type: "array",
        source: "children",
        selector: ".gx-title-extra-subtitle",
    },
    title: {
        type: "array",
        source: "children",
        selector: ".gx-title-extra-title",
    },
    description: {
        type: "array",
        source: "children",
        selector: ".gx-title-extra-description",
    },
};

export default attributes;
