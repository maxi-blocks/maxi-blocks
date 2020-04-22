const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import Checkbox from '../checkbox/index';

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
    <Checkbox
      label={__('Hide Subtitle', 'gutenberg-extra')}
      id='gx-new-window'
      checked={hideSubtitle}
      onChange={(newValue) => setAttributes({hideSubtitle: newValue})}
    />
  )
}
