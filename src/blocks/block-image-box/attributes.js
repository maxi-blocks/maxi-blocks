const attributes = {
    title: {
        type: 'array',
        source: 'children',
        selector: '.gx-image-box-title',
    },
    className: {
        type: 'string',
        default: '',
    },
    mediaID: {
        type: 'number',
    },
    mediaURL: {
        type: 'string',
        source: 'attribute',
        selector: '.gx-image-box-image',
        attribute: 'src',
    },
    description: {
        type: 'array',
        source: 'children',
        selector: '.gx-image-box-description',
    },
    additionalText: {
        type: 'array',
        source: 'children',
        selector: '.gx-image-box-subtitle',
    },
    line: {
        type: 'bool',
        selector: '.gx-image-box-line',
    },
    counter: {
        type: 'bool',
        selector: '.gx-image-box-counter',
    },
    readMoreText: {
        type: 'array',
        source: 'children',
        selector: '.gx-image-box-read-more-text',
    },
    readMoreLink: {
        type: 'string',
        source: 'attribute',
        selector: 'a.gx-image-box-link',
        attribute: 'href',
    },
    counter: {
        type: 'bool',
        source: 'children',
        selector: '.gx-image-box-counter',
    },
    borderColor: {
        type: 'string',
        default: "",
    },
    borderHoverColor: {
        type: 'string',
        default: "",
    },
    titleColor: {
        type: 'string',
        default: "",
    },
    backgroundColor: {
        type: 'string',
        default: "",
    },
    backgroundGradient: {
        type: 'string',
        default: "",
    },
    subTitleColor: {
        type: 'string',
        default: "",
    },
    descriptionColor: {
        type: 'string',
        default: "",
    },
    borderType: {
        type: 'string',
        default: 'none',
    },
    hoverAnimation: {
        type: 'string',
        default: 'none',
    },
    hoverAnimationDuration: {
        type: 'string',
        default: 'normal',
    },
    buttonColor: {
        type: 'string',
        default: "",
    },
    buttonBgColor: {
        type: 'string',
        default: "",
    },
    borderWidth: {
        type: 'number',
        default: 0,
    },
    borderRadius: {
        type: 'number',
        default: 0,
    },
    linkTitle: {
        type: 'string',
    },
    opensInNewWindow: {
        type: 'boolean',
        default: false,
    },
    addNofollow: {
        type: 'boolean',
        default: false,
    },
    addNoopener: {
        type: 'boolean',
        default: false,
    },
    addNoreferrer: {
        type: 'boolean',
        default: false,
    },
    addSponsored: {
        type: 'boolean',
        default: false,
    },
    addUgc: {
        type: 'boolean',
        default: false,
    },
    titlePopUpisVisible: {
        type: 'boolean',
        default: false,
    },
    blockWidth: {
        type: 'number',
    },
    minWidth: {
        type: 'number',
    },
    maxWidth: {
        type: 'number',
    },
    maxWidthUnit: {
        type: 'string',
        default: 'px',
    },
    maxHeight: {
        type: 'number',
    },
    maxHeightUnit: {
        type: 'string',
        default: 'px',
    },
    minWidthUnit: {
        type: 'string',
        default: 'px',
    },
    widthUnit: {
        type: 'string',
        default: '%',
    },
    heightUnit: {
        type: 'string',
        default: '%',
    },
    minHeightUnit: {
        type: 'string',
        default: 'px',
    },
    fontSizeTitleUnit: {
        type: 'string',
        default: 'px',
    },
    fontSizeTitle: {
        type: 'number',
    },
    blockHeight: {
        type: 'number',
    },
    minHeight: {
        type: 'number',
    },
    extraClassName: {
        type: 'string',
    },
    extraStyles: {
        type: 'string',
    },
    extraHoverStyles: {
        type: 'string',
    },
    extraBeforeStyles: {
        type: 'string',
    },
    extraAfterStyles: {
        type: 'string',
    },
    extraHoverBeforeStyles: {
        type: 'string',
    },
    extraHoverAfterStyles: {
        type: 'string',
    },
    imagePosition: {
        type: 'string',
        default: 'top',
    },
    titleLevel: {
        type: 'string',
        default: 'h2'
    },
    blockStyle: {
        type: 'string',
        default: 'gx-global'
    },
    defaultBlockStyle: {
        type: 'string',
        default: 'gx-def-light'
    },
    titleFontFamily: {
        type: 'string',
        default: 'inherit'
    }
}

export default attributes;