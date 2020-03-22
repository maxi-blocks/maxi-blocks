import { blockStyleAttributes } from '../../components/block-styles/index';
import { paddingMarginControlAttributes } from '../../components/padding-margin-control/index';
import { linkOptionsAttributes } from '../../components/link-options/index';
import { dividerAttributes } from '../../components/divider/index';
import { hideTitleAttributes } from '../../components/hide-title/index';
import { hideDescriptionAttributes } from '../../components/hide-description/index';
import { hideSubtitleAttributes } from '../../components/hide-subtitle/index';
import { twoColumnAttributes } from '../../components/two-column-description/index';
import { contentDirectionAttributes } from '../../components/content-direction/index';
import { titleColorAttributes } from '../../components/title-color/index';
import { subtitleColorAttributes } from '../../components/subtitle-color/index';
import { subtitleBackgroundColorAttributes } from '../../components/subtitle-background-color/index';
import { descriptionColorAttributes } from '../../components/description-color/index';
import { subtitleAlignAttributes } from '../../components/subtitle-align/index';
import { titleAlignAttributes } from '../../components/title-align/index';
import { descriptionAlignAttributes } from '../../components/description-align/index';
import { typographyAttributes } from '../../components/typography/index';

const attributes = {
  title: {
    type: 'string',
    source: 'children',
    selector: '.gx-title-extra-title',
  },
  subtitle: {
    type: 'array',
    source: 'children',
    selector: '.gx-title-extra-subtitle',
  },
  text: {
    type: 'array',
    source: 'children',
    selector: '.gx-title-extra-text',
  },
  additionalDivider:{
    type: 'string',
    default : ''
  },
  isBehindTheSubtitle:{
    type: 'boolean',
    default: false
  },
  titleLevel: {
      type: 'string',
      default: 'h2'
  },
  subtitleLevel: {
      type: 'string',
      default: 'h6'
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
  ...typographyAttributes
};

export default attributes;
