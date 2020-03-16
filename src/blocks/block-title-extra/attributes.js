import { blockStyleAttributes } from '../../components/block-styles/index';
import { paddingMarginControlAttributes } from '../../components/padding-margin-control/index';
import { linkOptionsAttributes } from '../../components/link-options/index';
import { dividerAttributes } from '../../components/divider/index';

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
  titleTextAlign:{
    type: 'string',
    default: 'center'
  },
  subtitleTextAlign:{
    type: 'string',
    default: '5px auto'
  },
  descriptionTextAlign:{
    type: 'string',
    default: 'center'
  },
  descriptionColor:{
    type: 'string',
    default: 'rgb(152,152,152)'
  },
  subtitleBackgroundColor:{
    type: 'string',
  },
  subtitleColor:{
    type: 'string',
    default: 'rgb(152,152,152)'
  },
  additionalDivider:{
    type: 'string',
    default : ''
  },
  hideTitle:{
    type: 'boolean',
    default:false
  },
  hideSubtitle:{
    type: 'booelan',
    default:false
  },
  hideDescription:{
    type: 'boolean',
    default:false
  },
  isBehindTheSubtitle:{
    type: 'boolean',
    default: false
  },
  twoColumnDesc:{
    type: 'boolean',
    default: false
  },
  contentDirection:{
    type: 'string',
    default: 'column'
  },
  ...blockStyleAttributes,
  ...linkOptionsAttributes,
  ...dividerAttributes
};

export default attributes;
