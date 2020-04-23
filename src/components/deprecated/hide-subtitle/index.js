const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import CheckBoxControl from '../checkbox-control';

export const titleExtraHideSubtitle = {
  hideSubtitle:{
    type: 'booelan',
    default:false
  },
}

export const HideSubtitle = ( props ) => {
  const {
      hideSubtitle = props.attributes.hideSubtitle,
      setAttributes,
  } = props;

  return (
    <CheckBoxControl
      label={__('Hide Subtitle', 'gutenberg-extra')}
      id='gx-new-window'
      checked={hideSubtitle}
      onChange={(newValue) => setAttributes({hideSubtitle: newValue})}
    />
  )
}
