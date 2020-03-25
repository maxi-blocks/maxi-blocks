import { hideTitleAttributes } from '../../components/hide-title/index';
import { hideSubtitleAttributes } from '../../components/hide-subtitle/index';
import { hideDescriptionAttributes } from '../../components/hide-description/index';
import { contentDirectionAttributes } from '../../components/content-direction/index';
import { subtitleAlignAttributes } from '../../components/icon-extra-subtitle-align/index';
import { titleAlignAttributes } from '../../components/title-align/index';
import { descriptionAlignAttributes } from '../../components/description-align/index';
import { customCSSAtributes } from '../../components/custom-css/index';
import { dividerAttributes } from '../../components/divider/index';
import { imageSettingsAttributes } from '../../components/icon-settings/index';
import { typographyAttributes } from '../../components/typography/attributes';

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
  ...customCSSAtributes,
  ...typographyAttributes,
  ...dividerAttributes,
  ...imageSettingsAttributes,
  isHidden:{
    type: 'boolean',
    default: true,
  },
}

export default attributes;
