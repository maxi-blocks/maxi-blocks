const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

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
  <ToggleControl
    label={__('Hide Title', 'gutenberg-extra')}
    id='gx-block-style'
    checked={hideTitle}
    onChange={(value) => {setAttributes({hideTitle: value})}}
  />
  )
}
