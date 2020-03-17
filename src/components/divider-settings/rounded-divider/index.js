const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

export const roudnedDividerAttributes = {
  isRounded:{
    type: 'boolean',
    default: false
  },
}

export const RoundedDivider = ( props ) => {
  const {
      isRounded = props.attributes.isRounded,
      setAttributes,
  } = props;

  return (
    <ToggleControl
      label={__('Rounded Divider', 'gutenberg-extra')}
      id='gx-block-style'
      checked={isRounded}
      onChange={(value) => setAttributes({isRounded: value})}
    />
  )
}
