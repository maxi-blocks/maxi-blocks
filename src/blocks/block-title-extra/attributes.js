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
    title: {
        type: "array",
        source: "children",
        selector: ".gx-title-extra-title",
    },
    subtitle: {
        type: "array",
        source: "children",
        selector: ".gx-title-extra-subtitle",
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
    background: {
        type: 'string',
        default: JSON.stringify(attributesData.background)
    },
    boxShadow: {
        type: "string",
        default: JSON.stringify(attributesData.boxShadow)
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
    border: {
        type: 'string',
        default: JSON.stringify(attributesData.border)
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
    text: {
        type: "array",
        source: "children",
        selector: ".gx-title-extra-text",
    },
    additionalDivider: {
        type: "string",
        default: "",
    },
    isBehindTheSubtitle: {
        type: "boolean",
        default: false,
    },
    classes: {
        type: "string",
    },
    titleColor: {
        type: "string",
        default: "black",
    },
    subtitleColor: {
        type: "string",
        default: "#9b9b9b",
    },
    descriptionColor: {
        type: "string",
        default: "#9b9b9b",
    },
    defaultPalette: {
        type: "array",
        default: [
            { offset: "0.00", color: "rgba(238, 55, 11, 1)" },
            { offset: "1.00", color: "rgba(126, 32, 34, 1)" },
        ],
    },
    divider: {
        type: 'string',
        default: JSON.stringify(attributesData.divider)
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
    subtitleTextAlign: {
        type: 'string',
        default: '5px auto'
    },
    titleTextAlign: {
        type: 'string',
        default: 'center'
    },
    descriptionTextAlign: {
        type: 'string',
        default: 'center'
    },
    subtitleBackgroundColor: {
        type: 'string',
        default: 'white'
    },
};

export default attributes;
