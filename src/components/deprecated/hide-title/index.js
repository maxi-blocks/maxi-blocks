const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import CheckBoxControl from '../checkbox-control';

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
    <CheckBoxControl
      label={__('Hide Title', 'maxi-blocks')}
      id='maxi-new-window'
      checked={hideTitle}
      onChange={(newValue) => setAttributes({hideTitle: newValue})}
    />
  )
}
