const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import Checkbox from '../checkbox/index';

export const hideTitleAttributes = {
  hideTitle:{
    type: 'boolean',
    default:false
  },
}

export const HideTitle = ( props ) => {
  const {
      hideTitle = props.attributes.hideTitle,
      setAttributes,
  } = props;

  return (
    <Checkbox
      label={__('Hide Title', 'gutenberg-extra')}
      id='gx-new-window'
      checked={hideTitle}
      onChange={(newValue) => setAttributes({hideTitle: newValue})}
    />
  )
}
