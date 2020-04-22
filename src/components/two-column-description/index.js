const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import Checkbox from '../checkbox/index';

export const twoColumnAttributes = {
  twoColumnDesc:{
    type: 'boolean',
    default: false
  },
}

export const TwoColumn = ( props ) => {
  const {
      twoColumnDesc = props.attributes.twoColumnDesc,
      setAttributes,
  } = props;

  return (
    <Checkbox
      label={__('Two Column Description Layout', 'gutenberg-extra')}
      id='gx-new-window'
      checked={twoColumnDesc}
      onChange={(newValue) => setAttributes({twoColumnDesc: newValue})}
    />
  )
}
