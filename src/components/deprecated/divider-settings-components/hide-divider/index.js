const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

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
    <ToggleControl
      label={__('Hide Divider', 'gutenberg-extra')}
      id='gx-block-style'
      checked={isHidden}
      onChange={(value) => setAttributes({isHidden: value})}
    />
  )
}
