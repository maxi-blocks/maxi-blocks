const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

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
    <ToggleControl
      label={__('Hide Subtitle', 'gutenberg-extra')}
      id='gx-block-style'
      checked={hideSubtitle}
      onChange={(value) => {setAttributes({hideSubtitle: value})}}
    />
  )
}
