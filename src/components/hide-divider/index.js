const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import Checkbox from '../checkbox/index';

export const hideDividerAttributes = {
  isHidden:{
    type: 'boolean',
    default: false
  },
}

export const HideDivider = ( props ) => {
  const {
      isHidden = props.attributes.isHidden,
      setAttributes,
  } = props;

  return (
    <Checkbox
      label={__('Hide Divider', 'gutenberg-extra')}
      id='gx-new-window'
      checked={isHidden}
      onChange={(newValue) => setAttributes({isHidden: newValue})}
    />
  )
}
