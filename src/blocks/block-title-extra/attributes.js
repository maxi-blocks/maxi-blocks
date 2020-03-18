import { blockStyleAttributes } from '../../components/block-styles/index';
import { paddingMarginControlAttributes } from '../../components/padding-margin-control/index';
import { linkOptionsAttributes } from '../../components/link-options/index';
import { dividerAttributes } from '../../components/divider/index';
import { hideTitleAttributes } from '../../components/title-extra/hide-title/index';
import { hideDescriptionAttributes } from '../../components/title-extra/hide-description/index';
import { hideSubtitleAttributes } from '../../components/title-extra/hide-subtitle/index';
import { twoColumnAttributes } from '../../components/title-extra/two-column-description/index';
import { titleTypographyAttributes } from '../../components/title-extra/title-typography/index';
import { contentDirectionAttributes } from '../../components/title-extra/content-direction/index';
import { titleColorAttributes } from '../../components/title-extra/title-color/index';
import { subtitleColorAttributes } from '../../components/title-extra/subtitle-color/index';
import { subtitleBackgroundColorAttributes } from '../../components/title-extra/subtitle-background-color/index';
import { descriptionColorAttributes } from '../../components/title-extra/description-color/index';
import { subtitleAlignAttributes } from '../../components/title-extra/subtitle-align/index';
import { titleAlignAttributes } from '../../components/title-extra/title-align/index';
import { descriptionAlignAttributes } from '../../components/title-extra/description-align/index';

const attributes = {
  title: {
    type: 'array',
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
  ...blockStyleAttributes,
  ...linkOptionsAttributes,
  ...dividerAttributes,
  ...hideTitleAttributes,
  ...hideDescriptionAttributes,
  ...hideSubtitleAttributes,
  ...twoColumnAttributes,
  ...titleTypographyAttributes,
  ...contentDirectionAttributes,
  ...titleColorAttributes,
  ...subtitleColorAttributes,
  ...descriptionColorAttributes,
  ...subtitleBackgroundColorAttributes,
  ...subtitleAlignAttributes,
  ...titleAlignAttributes,
  ...descriptionAlignAttributes
};

export default attributes;
