const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

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
    <ToggleControl
      label={__('Hide Description', 'maxi-blocks')}
      id='maxi-block-style'
      checked={hideDescription}
      onChange={(value) => {setAttributes({hideDescription: value})}}
    />
  )
}
