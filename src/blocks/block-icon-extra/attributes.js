import { hideTitleAttributes } from '../../components/hide-title/index';
import { hideSubtitleAttributes } from '../../components/hide-subtitle/index';
import { hideDescriptionAttributes } from '../../components/hide-description/index';
import { contentDirectionAttributes } from '../../components/content-direction/index';
import { subtitleAlignAttributes } from '../../components/icon-extra-subtitle-align/index';
import { titleAlignAttributes } from '../../components/title-align/index';
import { descriptionAlignAttributes } from '../../components/description-align/index';
import { iconColorAttributes } from '../../components/icon-color/index';
import { iconBackgroundColorAttributes } from '../../components/icon-background-color/index';
import { iconSizeAttributes } from '../../components/icon-size/index';
import { iconRotateAttributes } from '../../components/icon-rotate/index';
import { typographyAttributes } from '../../components/typography/index';
import { customCSSAtributes } from '../../components/custom-css/index';
import { dividerAttributes } from '../../components/divider/index';

const attributes = {
  title: {
    type: 'array',
    source: 'children',
    selector: '.gx-icon-extra-title',
  },
  subtitle: {
    type: 'array',
    source: 'children',
    selector: '.gx-icon-extra-subtitle',
  },
  description: {
    type: 'array',
    source: 'children',
    selector: '.gx-icon-extra-description',
  },
  titleLevel: {
      type: 'string',
      default: 'h1'
  },
  subtitleLevel: {
      type: 'string',
      default: 'h3'
  },
  classes:{
    type: 'string'
  },
  ...hideTitleAttributes,
  ...hideSubtitleAttributes,
  ...hideDescriptionAttributes,
  ...contentDirectionAttributes,
  ...subtitleAlignAttributes,
  ...titleAlignAttributes,
  ...descriptionAlignAttributes,
  ...iconColorAttributes,
  ...iconBackgroundColorAttributes,
  ...iconSizeAttributes,
  ...iconRotateAttributes,
  ...customCSSAtributes,
  ...typographyAttributes,
  ...dividerAttributes,
  isHidden:{
    type: 'boolean',
    default: true,
  },
}

export default attributes;
