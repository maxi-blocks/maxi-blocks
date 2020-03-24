import { hideTitleAttributes } from '../../components/hide-title/index';
import { hideSubtitleAttributes } from '../../components/hide-subtitle/index';
import { contentDirectionAttributes } from '../../components/content-direction/index';
import { subtitleAlignAttributes } from '../../components/icon-extra-subtitle-align/index';
import { titleAlignAttributes } from '../../components/title-align/index';


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
  titleLevel: {
      type: 'string',
      default: 'h2'
  },
  subtitleLevel: {
      type: 'string',
      default: 'h3'
  },
  ...hideTitleAttributes,
  ...hideSubtitleAttributes,
  ...contentDirectionAttributes,
  ...subtitleAlignAttributes,
  ...titleAlignAttributes
}

export default attributes;
