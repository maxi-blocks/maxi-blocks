import { blockStyleAttributes } from "../../components/block-styles/index";
import { paddingMarginControlAttributes } from "../../components/padding-margin-control/index";
import { linkOptionsAttributes } from "../../components/link-options/index";
import { dividerAttributes } from "../../components/divider/index";
import { hideTitleAttributes } from "../../components/hide-title/index";
import { hideDescriptionAttributes } from "../../components/hide-description/index";
import { hideSubtitleAttributes } from "../../components/hide-subtitle/index";
import { twoColumnAttributes } from "../../components/two-column-description/index";
import { contentDirectionAttributes } from "../../components/content-direction/index";
import { titleColorAttributes } from "../../components/title-color/index";
import { subtitleColorAttributes } from "../../components/subtitle-color/index";
import { subtitleBackgroundColorAttributes } from "../../components/subtitle-background-color/index";
import { descriptionColorAttributes } from "../../components/description-color/index";
import { subtitleAlignAttributes } from "../../components/subtitle-align/index";
import { titleAlignAttributes } from "../../components/title-align/index";
import { descriptionAlignAttributes } from "../../components/description-align/index";
import { defaultTypographyAttributes } from "../../components/typography/attributes";
import { customCSSAtributes } from "../../components/custom-css/index";
import { boxShadowOptionsAttributes } from "../../components/box-shadow";
import { borderAttributes } from "../../components/block-border/index";
import { typographyAttributes } from "../../components/typography/index";
import { hideDividerAttributes } from '../../components/hide-divider/index';
import { verticalDividerAttributes } from '../../components/vertical-divider/index';
import { roundedDividerAttributes } from '../../components/rounded-divider/index';
import { additionalDividerAttributes} from '../../components/additional-divider/index';
import { alignDividerAttributes } from '../../components/align-divider/index';
import { dividerPositionAttributes } from '../../components/divider-position/index';
import { dividerWidthAttributes } from '../../components/divider-width/index';
import { dividerHeightAttributes } from '../../components/divider-height/index';
import { dividerColorAttributes } from '../../components/divider-color/index';
import {
  dimensionsControlAttributesMargin,
  dimensionsControlAttributesPadding
} from "../../components/dimensions-control/attributes";

const attributes = {
  title: {
    type: "array",
    source: "children",
    selector: ".gx-title-extra-title"
  },
  subtitle: {
    type: "array",
    source: "children",
    selector: ".gx-title-extra-subtitle"
  },
  text: {
    type: "array",
    source: "children",
    selector: ".gx-title-extra-text"
  },
  additionalDivider: {
    type: "string",
    default: ""
  },
  isBehindTheSubtitle: {
    type: "boolean",
    default: false
  },
  titleLevel: {
    type: "string",
    default: "h2"
  },
  subtitleLevel: {
    type: "string",
    default: "h3"
  },
  classes: {
    type: "string"
  },
  backgroundColor: {
    type: "string",
    default: "white"
  },
  backgroundGradient: {
    type: "string",
    default: ""
  },
  backgroundGradient: {
    type: "array",
    default: []
  },
  defaultPalette: {
    type: "array",
    default: [
      { offset: "0.00", color: "rgba(238, 55, 11, 1)" },
      { offset: "1.00", color: "rgba(126, 32, 34, 1)" }
    ]
  },
  boxShadow: {
    type: "string",
    default:
      '{"label":"Box Shadow","shadowColor": "", "shadowHorizontal": "0", "shadowVertical": "0", "shadowBlur": "0", "shadowSpread": "0"}'
  },
  ...blockStyleAttributes,
  ...linkOptionsAttributes,
  ...dividerAttributes,
  ...hideTitleAttributes,
  ...hideDescriptionAttributes,
  ...hideSubtitleAttributes,
  ...twoColumnAttributes,
  ...contentDirectionAttributes,
  ...titleColorAttributes,
  ...subtitleColorAttributes,
  ...descriptionColorAttributes,
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
  ...defaultTypographyAttributes
};

export default attributes;
