/**
 * Imports
 */
import { blockStyleAttributes } from '../../components/block-styles/index';
import { imagePositionAttributes } from '../../components/image-position/index';
import { linkOptionsAttributes } from '../../components/link-options/index';
import { imageSettingsAttributes } from '../../components/image-settings';
import { buttonStyleAttributes } from '../../components/button-styles/index';
import { backgroundControlAttributes } from '../../components/background-control/';
import { borderAttributes } from '../../components/block-border/index';
import { sizeControlAttributes } from '../../components/size-control/index';
import {
    dimensionsControlAttributesMargin,
    dimensionsControlAttributesPadding,
} from '../../components/dimensions-control/attributes';
import { hoverAnimationAttributes } from '../../components/hover-animation/index';
import { customCSSAtributes } from '../../components/custom-css/index';
// Testing
import { sizeControlAttributesTest } from '../../components/size-control/test/';
import { borderAttributesTest } from '../../components/block-border/test';

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
        default: '{"label":"Title","font":"Roboto","options":{"100":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","300":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","400":"http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","500":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","700":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","900":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","100italic":"http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","italic":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":26,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    },
    subtitleFontOptions: {
        type: 'string',
        default: '{"label":"Subtitle","font":"Roboto","options":{"100":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","300":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","400":"http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","500":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","700":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","900":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","100italic":"http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","italic":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":26,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    },
    descriptionFontOptions: {
        type: 'string',
        default: '{"label":"Description","font":"Roboto","options":{"100":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","300":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","400":"http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","500":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","700":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","900":"http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","100italic":"http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","italic":"http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900italic":"http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":26,"line-heightUnit":"px","line-height":26,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
    },
    ...imageSettingsAttributes,
    ...buttonStyleAttributes,
    ...backgroundControlAttributes,
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
    // Testing
    ...sizeControlAttributesTest,
    ...borderAttributesTest
}

export default attributes;