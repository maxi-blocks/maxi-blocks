import { blockStyleAttributes } from '../../components/block-styles/index';
import { paddingMarginControlAttributes } from '../../components/padding-margin-control/index';
import { linkOptionsAttributes } from '../../components/link-options/index';

const attributes = {
  title: {
      type: 'array',
      source: 'children',
      selector: '.gx-title-extra-title',
  },
  subtitle: {
      type: 'array',
      source: 'children',
      selector: '.gx-title-extra-title',
  },
  ...blockStyleAttributes,
  ...linkOptionsAttributes
};

export default attributes;
