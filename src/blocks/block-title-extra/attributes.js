import { blockStyleAttributes } from "../../components/block-styles/index";
import { paddingMarginControlAttributes } from "../../components/padding-margin-control/index";
import { linkOptionsAttributes } from "../../components/link-options/index";
import { dividerAttributes } from "../../components/divider/index";
import { hideTitleAttributes } from "../../components/hide-title/index";
import { hideDescriptionAttributes } from "../../components/hide-description/index";
import { hideSubtitleAttributes } from "../../components/hide-subtitle/index";
import { twoColumnAttributes } from "../../components/two-column-description/index";
import { contentDirectionAttributes } from "../../components/content-direction/index";
import { subtitleBackgroundColorAttributes } from "../../components/subtitle-background-color/index";
import { subtitleAlignAttributes } from "../../components/subtitle-align/index";
import { titleAlignAttributes } from "../../components/title-align/index";
import { descriptionAlignAttributes } from "../../components/description-align/index";
import { defaultTypographyAttributes } from "../../components/typography/attributes";
import { customCSSAtributes } from "../../components/custom-css/index";
import { boxShadowOptionsAttributes } from "../../components/box-shadow";
import { borderAttributes } from "../../components/block-border/index";
import { typographyAttributes } from "../../components/typography/index";
import { hideDividerAttributes } from "../../components/hide-divider/index";
import { verticalDividerAttributes } from "../../components/vertical-divider/index";
import { roundedDividerAttributes } from "../../components/rounded-divider/index";
import { additionalDividerAttributes } from "../../components/additional-divider/index";
import { alignDividerAttributes } from "../../components/align-divider/index";
import { dividerPositionAttributes } from "../../components/divider-position/index";
import { dividerWidthAttributes } from "../../components/divider-width/index";
import { dividerHeightAttributes } from "../../components/divider-height/index";
import { dividerColorAttributes } from "../../components/divider-color/index";
import {
  dimensionsControlAttributesMargin,
  dimensionsControlAttributesPadding,
} from "../../components/dimensions-control/attributes";

const attributes = {
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
  titleLevel: {
    type: "string",
    default: "h1",
  },
  subtitleLevel: {
    type: "string",
    default: "h3",
  },
  classes: {
    type: "string",
  },
  backgroundColor: {
    type: "string",
    default: "white",
  },
  backgroundGradient: {
    type: "string",
    default: "",
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
  boxShadow: {
    type: "string",
    default:
      '{"label":"Box Shadow","shadowColor": "", "shadowHorizontal": "0", "shadowVertical": "0", "shadowBlur": "0", "shadowSpread": "0"}',
  },
  FontTitleOptions: {
    type: "string",
    default:
      '{"label":"Title","font": "Roboto", "options": {"100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":38,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
  },
  FontSubtitleOptions: {
    type: "string",
    default:
      '{"label":"Subtitle","font": "Roboto", "options": {"100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"black"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
  },
  FontDescriptionOptions: {
    type: "string",
    default:
      '{"label":"Description", "font": "Roboto", "options": {"100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf","100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf","300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf","300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf","400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf","italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf","500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf","500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf","700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf","700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf","900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf","900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"},"general":{"color":"#9b9b9b"},"desktop":{"font-sizeUnit":"px","font-size":16,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"tablet":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"},"mobile":{"font-sizeUnit":"px","font-size":0,"line-heightUnit":"px","line-height":0,"letter-spacingUnit":"px","letter-spacing":0,"font-weight":400,"text-transform":"none","font-style":"normal","text-decoration":"none"}}',
  },
  ...blockStyleAttributes,
  ...linkOptionsAttributes,
  ...dividerAttributes,
  ...hideTitleAttributes,
  ...hideDescriptionAttributes,
  ...hideSubtitleAttributes,
  ...twoColumnAttributes,
  ...contentDirectionAttributes,
  ...subtitleBackgroundColorAttributes,
  ...subtitleAlignAttributes,
  ...titleAlignAttributes,
  ...descriptionAlignAttributes,
  ...typographyAttributes,
  ...customCSSAtributes,
  ...boxShadowOptionsAttributes,
  ...dimensionsControlAttributesMargin,
  ...dimensionsControlAttributesPadding,
  ...borderAttributes,
  ...hideDividerAttributes,
  ...verticalDividerAttributes,
  ...roundedDividerAttributes,
  ...additionalDividerAttributes,
  ...alignDividerAttributes,
  ...dividerPositionAttributes,
  ...dividerWidthAttributes,
  ...dividerHeightAttributes,
  ...dividerColorAttributes,
  ...defaultTypographyAttributes,
};

export default attributes;