const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import Checkbox from '../checkbox/index';

export const hideDescriptionAttributes = {
  hideDescription:{
    type: 'booelan',
    default:false
  },
}

export const HideDescription = ( props ) => {
  const {
      hideDescription = props.attributes.hideDescription,
      setAttributes,
  } = props;

  return (
    <Checkbox
      label={__('Hide Description', 'gutenberg-extra')}
      id='gx-new-window'
      checked={hideDescription}
      onChange={(newValue) => setAttributes({hideDescription: newValue})}
    />
  )
}
