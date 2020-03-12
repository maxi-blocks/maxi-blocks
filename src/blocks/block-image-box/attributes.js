import { blockStyleAttributes } from '../../components/block-styles/index';
import { imagePositionAttributes } from '../../components/image-position/index';
import { blockBorderAttributes } from '../../components/block-border/index';
import { sizeControlAttributes } from '../../components/size-control/index';
import { hoverAnimationAttributes } from '../../components/hover-animation/index';
import { customCSSAtributes } from '../../components/custom-css/index';
import { linkOptionsAttributes } from '../../components/link-options/index';
import { 
    dimensionsControlAttributesMargin,
    dimensionsControlAttributesPadding,
} from '../../components/dimensions-control/attributes';
import {typographyAttributes} from '../../components/typography'

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
        type: 'string',
        source: 'attribute',
        selector: 'a.gx-image-box-link',
        attribute: 'href',
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
    buttonColor: {
        type: 'string',
        default: "",
    },
    buttonBgColor: {
        type: 'string',
        default: "",
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
    fontSizeTitleUnit: {
        type: 'string',
        default: 'px',
    },
    fontSizeTitle: {
        type: 'number',
    },
    titleLevel: {
        type: 'string',
        default: 'h2'
    },
    titleFontFamily: {
        type: 'string',
        default: 'inherit'
    },
    ...blockStyleAttributes,
    ...imagePositionAttributes,
    ...blockBorderAttributes,
    ...sizeControlAttributes,
    ...hoverAnimationAttributes,
    ...customCSSAtributes,
    ...linkOptionsAttributes,
    ...dimensionsControlAttributesMargin,
    ...dimensionsControlAttributesPadding,
    ...typographyAttributes,
    titlePopUpisVisible: {
        type: 'boolean',
        default: false,
    },
    paddingTitle: {
        type: 'string',
            default: '{"label":"Padding","unit":"px","max":"1000","desktop":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"tablet":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true},"mobile":{"padding-top":0,"padding-right":0,"padding-bottom":0,"padding-left":0,"sync":true}}'
    }
}

export default attributes;