/**
 * Imports
 */
import { blockStyleAttributes } from '../../components/block-styles/index';
import { borderAttributes } from '../../components/block-border/index';
import { imagePositionAttributes } from '../../components/image-position/index';
import { sizeControlAttributes } from '../../components/size-control/index';
import { hoverAnimationAttributes } from '../../components/hover-animation/index';
import { customCSSAtributes } from '../../components/custom-css/index';
import { linkOptionsAttributes } from '../../components/link-options/index';
import { dividerAttributes} from '../../components/divider/index';
import { buttonStyleAttributes } from '../../components/button-styles/index';
import {defaultTypographyAttributes} from '../../components/typography/attributes';
import {imageSettingsAttributes} from '../../components/image-settings';
import {boxShadowOptionsAttributes} from '../../components/box-shadow';
import {
    dimensionsControlAttributesMargin,
    dimensionsControlAttributesPadding,
} from '../../components/dimensions-control/attributes';
// Testing
import { sizeControlAttributesTest } from '../../components/size-control/test/';
import { backgroundControlAttributes } from '../../components/background-control/';

/**
 * Attributes
 */
const attributes = {
    ...blockStyleAttributes,
    ...imagePositionAttributes,
    titleLevel: {
        type: 'string',
        default: 'h2'
    },
    linkTitle: {
        type: 'string',
    },
    ...linkOptionsAttributes,
    titleFontOptions: {
        type: 'string',
        default: '{"label":"Title","font":"Default","options":{},"general":{"color":""},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    },
    subtitleFontOptions: {
        type: 'string',
        default: '{"label":"Subtitle","font":"Default","options":{},"general":{"color":""},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    },
    descriptionFontOptions: {
        type: 'string',
        default: '{"label":"Description","font":"Default","options":{},"general":{"color":""},"desktop":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    },
    ...imageSettingsAttributes,
    ...buttonStyleAttributes,
    backgroundColor: {
        type: 'string',
    },
    backgroundGradient: {
        type: 'string',
    },
    backgroundGradientAboveBackground: {
        type: 'boolean',
        default: false
    },
    // BackgroundImage???
    boxShadow: {
        type: 'string',
        default: '{"label":"Box Shadow","shadowColor": "", "shadowGradient": "", "shadowHorizontal": "0", "shadowVertical": "0", "shadowBlur": "0", "shadowSpread": "0"}'
    },
    ...borderAttributes,
    ...sizeControlAttributes,
    ...dimensionsControlAttributesMargin,
    ...dimensionsControlAttributesPadding,
    ...hoverAnimationAttributes,
    ...customCSSAtributes,
    // BlockStyle ????
    mediaID: {
        type: 'number',
    },
    title: {
        type: 'array',
        source: 'children',
        selector: '.gx-image-box-title',
    },
    additionalText: {
        type: 'array',
        source: 'children',
        selector: '.gx-image-box-subtitle',
    },
    description: {
        source: 'children',
        selector: '.gx-image-box-description',
    },
    readMoreText: {
        type: 'string',
        selector: 'span.gx-image-box-read-more-text',
    },
    readMoreLink: {
        type: 'string',
        selector: 'a.gx-image-box-read-more-link',
        attribute: 'href'
    },
    // Testing
    readMoreTextTest: {
        type: 'string',
    },
    readMoreLinkTest: {
        type: 'string',
        default: '{}'
    },
    ...sizeControlAttributesTest,
    ...backgroundControlAttributes
}

export default attributes;